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

  size(): number {
    return Object.keys(this.record).length;
  }

  merge(merge: Record): Record {
    return new Record(Object.assign({}, merge.unwrap(), this.record));
  }

  project(fields: string[]) {
    const result: any = {};
    fields.forEach((f) => (result[f] = this.get(f)));
    return new Record(result);
  }

  private unwrap() {
    return this.record;
  }
}
