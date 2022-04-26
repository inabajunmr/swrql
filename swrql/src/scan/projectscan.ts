import { Record, Scan } from './scan';

export class ProjectScan implements Scan {
  private readonly scan: Scan;
  private readonly fields: string[];
  constructor(scan: Scan, fields: string[]) {
    this.scan = scan;
    this.fields = fields;
  }

  next(): boolean {
    return this.scan.next();
  }

  getRecord(): Record {
    return this.scan.getRecord().project(this.fields);
  }

  rewind(): void {
    this.scan.rewind();
  }
}
