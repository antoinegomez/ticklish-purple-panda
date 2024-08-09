import { mkdirSync, writeFileSync } from "node:fs";
import { DocumentSchema, type Document, SpendingOver25CollectionSchema, SpendingOver25Collection } from "./lib/schemas";
import { SemaphoreTaskQueue } from "./lib/semaphore";

const tasksQueue = new SemaphoreTaskQueue(5);

function httpGet<D extends "json" | "text">(url: string, type: D): D extends "json" ? Promise<unknown> : Promise<Response> {
  return tasksQueue.addTask(() =>
    fetch(url).then((response) => {
      if (type === "json") {
        return response.json();
      }

      return response;
    }),
  );
}

async function fetchDocument(document: SpendingOver25Collection["links"]["documents"][number]) {
  console.log(`downloading document ${document.title}`);
  const data = await httpGet(document.api_url, "json");
  const parsed = DocumentSchema.parse(data);
  await downloadCsvFromDocument(parsed);
}

async function downloadCsvFromDocument(document: Document) {
  const found = document.details.attachments.find((doc) => doc.content_type === "text/csv");

  if (!found) {
    throw new Error(`No CSV found for document ${document.title} with id ${document.content_id}`);
  }

  console.log(`downloading csv ${document.title}`);
  const response = await httpGet(found.url, "text");
  const data = await response.blob();
  mkdirSync("cache/csv/", { recursive: true });
  writeFileSync(`cache/csv/${document.content_id}.csv`, Buffer.from(await data.arrayBuffer()));
}

function filterDocumentsCapture(...rest: (string | number)[]) {
  return String(Number(rest[2]) >= 2020);
}

async function main() {
  const response = await fetch(
    "https://www.gov.uk/api/content/government/collections/spending-over-25-000",
    // "https://www.gov.uk/api/content/government/collections/dfe-department-and-executive-agency-spend-over-25-000"
  );
  const data = await response.json();

  const parsed = SpendingOver25CollectionSchema.safeParse(data);

  const documents =
    parsed.data?.links.documents.filter((doc) => doc.title.replace(/(.+)(\d{4})$/, filterDocumentsCapture) === "true") ?? [];
  for (let doc of documents) {
    await fetchDocument(doc);
  }
}

main();
