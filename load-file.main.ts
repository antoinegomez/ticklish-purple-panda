import Papa from "papaparse";
import fs from "fs";
import { getDBConnection } from "./db";
import { parseAmount } from "./scraperUtils";
import { formatToIso } from "./lib/date-parser";
import { Knex } from "knex";

const BATCH_LIMIT = 500;

/**
 * This script loads a csv file containg spending data in gov.uk/HMRC format
 * into the `spend_transactions` table in a SQLite database.
 *
 * Some basic validation is performed.
 */

// Common data format of _some_ of the spend files.
// Might have to support other formats in the future but this is ok for HMRC & DfT
type GovUKData = {
  "Department family": string;
  Entity: string;
  Date: string;
  "Expense type": string;
  "Expense area": string;
  Supplier: string;
  "Transaction number": string;
  Amount: string;
  Description: string;
  "Supplier Postcode": string;
};

// Corresponds to the spend_transactions table in the database
type SpendTransaction = {
  buyer_name: string;
  supplier_name: string;
  amount: number;
  transaction_timestamp: string; // should be iso format
};

export type LoadFileOptions = {
  knexDb?: Knex;
  destroyDb?: boolean;
};

export async function main(csvPath: string, { knexDb: _knexDb, destroyDb }: LoadFileOptions = { destroyDb: true }) {
  console.log(`Reading ${csvPath}.`);
  const csvContent = fs.readFileSync(csvPath, { encoding: "utf8" });
  const csvData = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true, // some files have empty newlines at the end
  });

  console.log(`Read ${csvData.data.length} transactions.`);
  console.debug(`First row: ${JSON.stringify(csvData.data[0])}`);

  const knexDb = _knexDb ? _knexDb : await getDBConnection();

  let batchNum = 1;
  const batch = [];
  for (const row of csvData.data) {
    try {
      // Add more validation in the future?
      const spendDataRow = row as GovUKData;

      // Some files have hundreds of rows with no data at the end, just commas.
      // It's safe to skip these.
      if (spendDataRow.Entity === "") {
        continue;
      }

      const isoTsp = formatToIso(spendDataRow["Date"]);

      batch.push({
        buyer_name: spendDataRow["Entity"],
        supplier_name: spendDataRow["Supplier"],
        amount: parseAmount(spendDataRow["Amount"]),
        transaction_timestamp: isoTsp,
      });

      if (batch.length >= BATCH_LIMIT) {
        await knexDb.batchInsert<SpendTransaction>("spend_transactions", batch);
        ++batchNum;
        batch.splice(0, BATCH_LIMIT);
      }
    } catch (e) {
      // Re-throw all errors, but log some useful info
      console.error(`Failed to process batch ${batchNum}: ${JSON.stringify(row)}`);
      throw e;
    }
  }

  // any remaining items need to be inserted
  if (batch.length) {
    try {
      await knexDb.batchInsert<SpendTransaction>("spend_transactions", batch);
    } catch (e) {
      // Re-throw all errors, but log some useful info
      console.error(`Failed to process row ${batchNum}`);
      throw e;
    }
  }

  console.log("Finished writing to the DB.");
  destroyDb && (await knexDb.destroy());
}

if (require.main === module) {
  main(process.argv[2], { destroyDb: true });
}
