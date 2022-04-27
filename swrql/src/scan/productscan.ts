import { Record, Scan } from './scan';

/**
 * project multiple scan.
 */
export class ProductScan implements Scan {
  private readonly scan1;
  private readonly scan2;
  private readonly noRecord: boolean;

  constructor(scan1: Scan, scan2: Scan) {
    this.scan1 = scan1;
    this.scan2 = scan2;
    this.noRecord = !this.scan1.next();
  }

  next(): boolean {
    if (this.noRecord) {
      return false;
    }
    if (this.scan2.next()) {
      return true;
    }
    if (this.scan1.next()) {
      this.scan2.rewind();
      if (this.scan2.next()) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  getRecord(): Record {
    return this.scan1.getRecord().merge(this.scan2.getRecord());
  }

  rewind(): void {
    this.scan1.rewind();
    this.scan2.rewind();
  }
}
