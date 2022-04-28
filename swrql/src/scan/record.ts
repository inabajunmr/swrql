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

  keys(): string[] {
    return Object.keys(this.record);
  }

  merge(merge: Record): Record {
    return new Record(Object.assign({}, merge.unwrap(), this.record));
  }

  project(fields: string[]) {
    const result: any = {};
    fields.forEach((f) => (result[f] = this.get(f)));
    return new Record(result);
  }

  unwrap() {
    return this.record;
  }
}
