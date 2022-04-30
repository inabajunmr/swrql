import { Scan } from './scan';
import { Record } from './record';
import { SelectField, SelectTarget } from '../sql/parser';

/**
 * filter only specified fields.
 */
export class ProjectScan implements Scan {
  private readonly scan: Scan;
  private readonly specifiedFields: string[];
  constructor(scan: Scan, targets: SelectTarget[]) {
    this.scan = scan;
    this.specifiedFields = targets.map((t) => t.toFieldName());
  }
  fields(): string[] {
    if (this.specifiedFields[0] === '*') {
      return this.scan.fields();
    }

    return this.specifiedFields;
  }

  next(): boolean {
    return this.scan.next();
  }

  getRecord(): Record {
    if (this.specifiedFields[0] === '*') {
      return this.scan.getRecord();
    }
    return this.scan.getRecord().project(this.specifiedFields);
  }

  rewind(): void {
    this.scan.rewind();
  }
}
