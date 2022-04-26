import { Record, Scan } from './scan';

export class ProductScan implements Scan {
  private readonly scan1;
  private readonly scan2;

  constructor(scan1: Scan, scan2: Scan) {
    this.scan1 = scan1;
    this.scan2 = scan2;
  }

  next(): boolean {
    if (this.scan2.next()) {
      return true;
    }
    if (this.scan1.next()) {
      this.scan2.rewind();
      return true;
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
