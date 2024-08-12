/**
 *
 * Source:
 * https://observablehq.com/@mbostock/localized-number-parsing
 *
 * No need to re-invent the wheel. This works quite well to format localized numbers.
 */
export class NumberParser {
  private _group: RegExp;
  private _decimal: RegExp;
  private _numeral: RegExp;
  private _index: (d: string) => string;

  constructor(locale: string) {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const numerals = [...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)].reverse();
    const index = new Map(numerals.map((d, i) => [d, String(i)]));
    this._group = new RegExp(`[${parts.find((d) => d.type === "group")?.value}]`, "g");
    this._decimal = new RegExp(`[${parts.find((d) => d.type === "decimal")?.value}]`);
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = (d) => index.get(d)!;
  }

  parse(string: string) {
    return (string = string.trim().replace(this._group, "").replace(this._decimal, ".").replace(this._numeral, this._index))
      ? +string
      : NaN;
  }
}

// Shortcut to get the english locale
// Also add support to parse the local currency
//
// But it might be a better idea to extract it to another module/function
// and let the user remove all curre onces from the number instead
export class EnglishNumberParser extends NumberParser {
  constructor() {
    super("en");
  }

  parse(string: string) {
    return super.parse(string.replace(/[£]/, ""));
  }
}
