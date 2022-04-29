import { Record } from './record';
import { Scan } from './scan';

export class SortScan implements Scan {
  private readonly materialized: Record[] = [];
  private index: number;
  private originalFields: string[];

  constructor(scan: Scan, sortKeys: string[], isASC: boolean) {
    this.originalFields = scan.fields();
    while (scan.next()) {
      this.materialized.push(scan.getRecord());
    }
    this.materialized = this.materialized.sort((a: Record, b: Record) => {
      for (const key of sortKeys) {
        if (a.get(key) > b.get(key)) {
          if (isASC) {
            return 1;
          } else {
            return -1;
          }
        } else if (a.get(key) < b.get(key)) {
          if (isASC) {
            return -1;
          } else {
            return 1;
          }
        }
      }
      return 0;
    });
    this.index = -1;
  }

  next(): boolean {
    this.index++;
    if (this.index >= this.materialized.length) {
      return false;
    }
    return true;
  }

  rewind() {
    this.index = -1;
  }

  getRecord(): Record {
    return this.materialized[this.index];
  }

  fields(): string[] {
    return this.originalFields;
  }
}
