import { DateTime } from "luxon";

const SUPPORTED_FORMATS = ["dd-MM-yyyy", "dd/MM/yyyy"];

export function formatToIso(input: string): string | never {
  for (let format of SUPPORTED_FORMATS) {
    const isoTsp = DateTime.fromFormat(input, format).toISO();
    if (isoTsp) {
      return isoTsp;
    }
  }
  throw new Error(`Invalid transaction timestamp ${input}.`);
}
