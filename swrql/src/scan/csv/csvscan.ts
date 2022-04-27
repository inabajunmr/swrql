import { Scan } from '../scan';
import { Record } from '../record';
import { parse } from 'csv-parse/sync';

export class CSVScan implements Scan {
  readonly tableName: string;
  private index: number;
  private readonly records: any;
  private readonly headers: string[];

  constructor(tableName: string, csv: string) {
    this.tableName = tableName;
    this.records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      rtrim: true,
      ltrim: true,
    });
    this.headers = parse(csv, {
      columns: false,
      skip_empty_lines: true,
      rtrim: true,
      ltrim: true,
    })[0];
    this.index = -1;
  }

  fields(): string[] {
    return this.headers;
  }

  next(): boolean {
    this.index++;
    if (this.index >= this.records.length) {
      return false;
    }
    return true;
  }

  rewind() {
    this.index = -1;
  }

  getRecord(): Record {
    return new Record(this.records[this.index]);
  }
}
