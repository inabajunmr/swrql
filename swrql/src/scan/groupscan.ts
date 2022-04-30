import { SelectFunction } from '../sql/parser';
import { Record } from './record';
import { Scan } from './scan';
import { SortScan } from './sortscan';

export class GroupScan implements Scan {
  private readonly scan: SortScan;
  private readonly groupByKeys: string[];
  private readonly functions: SelectFunction[];
  private currentRecord: Record | undefined;
  private currentAggregation: Record[] = [];
  private last = false;

  constructor(scan: Scan, groupByKeys: string[], functions: SelectFunction[]) {
    this.scan = new SortScan(scan, groupByKeys, true);
    this.groupByKeys = groupByKeys;
    this.functions = functions;
  }

  next(): boolean {
    this.currentAggregation = [];
    if (this.currentRecord !== undefined) {
      this.currentAggregation.push(this.currentRecord);
    }
    let nextExist = false; // it will be false when this.scan.next() returns false
    while (this.scan.next()) {
      if (this.currentRecord !== undefined) {
        if (
          this.currentRecord
            .project(this.groupByKeys)
            .equals(this.scan.getRecord().project(this.groupByKeys))
        ) {
          this.currentAggregation.push(this.scan.getRecord());
        } else {
          this.currentRecord = this.scan.getRecord();
          nextExist = true;
          break;
        }
      } else {
        this.currentRecord = this.scan.getRecord();
        this.currentAggregation.push(this.scan.getRecord());
      }
    }

    let result = true;
    if (this.last) {
      result = false;
    }
    if (!nextExist) {
      this.last = true;
    }
    return result;
  }

  getRecord(): Record {
    const record = this.currentAggregation[0].project(this.groupByKeys);
    const aggregated: any = {};
    this.functions.map((f) => {
      const arg = f.arg;
      const type = f.functionType;
      const count = this.currentAggregation.reduce((previous, current) => {
        // TODO count
        return ++previous;
      }, 0);
      aggregated[`${type}(${arg})`] = `${count}`;
    });
    const a = record.merge(new Record(aggregated));
    return a;
  }

  rewind(): void {
    this.scan.rewind();
    this.currentRecord = undefined;
    this.currentAggregation = [];
  }

  fields(): string[] {
    return [
      ...this.groupByKeys,
      ...this.functions.map((f) => {
        return f.toFieldName();
      }),
    ];
  }
}
