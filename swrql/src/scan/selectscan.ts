import { Predicate } from '../predicate/predicate';
import { Scan } from './scan';
import { Record } from './record';

/**
 * Extract records match agaist predicate
 */
export class SelectScan implements Scan {
  private readonly scan: Scan;
  private readonly predicate: Predicate;
  constructor(scan: Scan, predicate: Predicate) {
    this.scan = scan;
    this.predicate = predicate;
  }
  fields(): string[] {
    return this.scan.fields();
  }

  next(): boolean {
    while (this.scan.next()) {
      if (this.predicate.test(this.getRecord())) {
        return true;
      }
    }
    return false;
  }

  getRecord(): Record {
    return this.scan.getRecord();
  }

  rewind(): void {
    this.scan.rewind();
  }
}
