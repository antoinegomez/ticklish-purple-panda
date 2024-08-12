import { dirname } from "path";
import { readFileSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { DocumentSchema, type Document, SpendingOver25CollectionSchema, SpendingOver25Collection } from "./lib/schemas";
import { SemaphoreTaskQueue } from "./lib/semaphore";
import { main as loadFile } from "./load-file.main";
import { getDBInstance } from "./db";

const tasksQueue = new SemaphoreTaskQueue(5);

type CacheOptions = {
  readCache?: boolean;
  run: () => Promise<unknown | string | Buffer>;
  afterRead?: (data: string) => Promise<unknown>;
  beforeWrite?: (data: unknown) => Promise<string | Buffer>;
};

async function cache(
  key: string,
  { readCache = true, afterRead: existsCallback, beforeWrite: missingCallback, run }: CacheOptions,
): Promise<unknown> {
  const exists = statSync(key, { throwIfNoEntry: false });

  if (exists?.isFile()) {
    if (!readCache) {
      return null;
    }

    const data = readFileSync(key).toString();
    return existsCallback ? existsCallback(data) : data;
  } else {
    const data = await run();
    mkdirSync(dirname(key), { recursive: true });
    missingCallback ? writeFileSync(key, await missingCallback(data)) : writeFileSync(key, data as string | Buffer);
    return data;
  }
}

function httpGet<D extends "json" | "text">(url: string, type: D): D extends "json" ? Promise<unknown> : Promise<Response> {
  return tasksQueue.addTask(() => {
    console.log(`downloading ${url}`);
    return fetch(url).then((response) => {
      if (type === "json") {
        return response.json();
      }

      return response;
    });
  });
}

async function fetchDocument(document: SpendingOver25Collection["links"]["documents"][number]) {
  const data = await cache(`cache/documents/${document.content_id}.json`, {
    afterRead: (_data) => JSON.parse(_data),
    run: async () => {
      return await httpGet(document.api_url, "json");
    },
    beforeWrite: async (_data) => JSON.stringify(_data),
  });

  const parsed = DocumentSchema.parse(data);

  writeFileSync(`cache/documents/${document.content_id}.json`, JSON.stringify(parsed, null, 2));

  await downloadCsvFromDocument(parsed).catch((err) => console.log(`Error downloading CSV: ${err.message}`));
}

async function downloadCsvFromDocument(document: Document) {
  const found = document.details.attachments.find((doc) => doc.content_type === "text/csv");

  if (!found) {
    throw new Error(`No CSV found for document ${document.title} with id ${document.content_id}`);
  }

  const csvPath = `cache/csv/${document.content_id}.csv`;
  await cache(csvPath, {
    readCache: false,
    run: async () => {
      const response = await httpGet(found.url, "text");
      const data = await response.blob();
      return Buffer.from(await data.arrayBuffer());
    },
  });

  await loadFile(csvPath, { destroyDb: false, knexDb: await getDBInstance() }).catch((err) =>
    console.log(`Error loading CSV: ${err.message.substring(0, 100)}`),
  );
}

function filterDocumentsCapture(...rest: (string | number)[]) {
  return String(Number(rest[2]) >= 2020);
}

async function main(documentsUrl: string) {
  const response = await fetch(
    documentsUrl,
    // "https://www.gov.uk/api/content/government/collections/dfe-department-and-executive-agency-spend-over-25-000"
  );
  const data = await response.json();

  const parsed = SpendingOver25CollectionSchema.safeParse(data);

  const documents =
    parsed.data?.links.documents.filter((doc) => doc.title.replace(/(.+)(\d{4})$/, filterDocumentsCapture) === "true") ?? [];
  for (let doc of documents) {
    await fetchDocument(doc);
  }
  const dbInstance = await getDBInstance();
  await dbInstance.destroy();
  console.log("done");
}

main(process.argv["2"] || "https://www.gov.uk/api/content/government/collections/spending-over-25-000");
