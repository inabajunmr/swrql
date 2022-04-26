export interface Scan {
  next(): boolean;
  getRecord(): Record;
}

export class Record {
  private readonly record: any;

  constructor(record: any) {
    this.record = record;
  }

  get(field: string): string {
    return this.record[field];
  }
}
