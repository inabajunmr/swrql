import { Record, Scan } from '../scan';
import { parse } from 'csv-parse/sync';

export class CSVScan implements Scan {
  readonly tableName: string;
  private index: number;
  private readonly records: any;

  constructor(tableName: string, csv: string) {
    this.tableName = tableName;
    this.records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      rtrim: true,
      ltrim: true,
    });
    this.index = -1;
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
