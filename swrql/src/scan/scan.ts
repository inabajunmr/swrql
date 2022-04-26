export interface Scan {
  next(): boolean;
  getRecord(): Record;
  rewind(): void;
}

export class Record {
  private readonly record: any;

  constructor(record: any) {
    this.record = record;
  }

  get(field: string): string {
    return this.record[field];
  }

  merge(merge: Record): Record {
    return new Record(Object.assign({}, merge.unwrap(), this.record));
  }

  private unwrap() {
    return this.record;
  }
}
