import { Predicate } from '../predicate/predicate';
import { Record, Scan } from './scan';

export class SelectScan implements Scan {
  private readonly scan: Scan;
  private readonly predicate: Predicate;
  constructor(scan: Scan, predicate: Predicate) {
    this.scan = scan;
    this.predicate = predicate;
  }

  next(): boolean {
    if (!this.scan.next()) {
      return false;
    }
    while (!this.predicate.test(this.getRecord())) {
      if (!this.scan.next()) {
        return false;
      }
    }
    return true;
  }

  getRecord(): Record {
    return this.scan.getRecord();
  }
}
