import { Predicate } from '../predicate/predicate';
import { Record } from './record';
import { Scan } from './scan';

export class OuterJoinScan implements Scan {
  private readonly left;
  private readonly right;
  private init = true;
  private readonly predicate: Predicate;
  private current: Record | undefined;

  constructor(left: Scan, right: Scan, predicate: Predicate) {
    this.left = left;
    this.right = right;
    this.predicate = predicate;
  }

  next(): boolean {
    if (!this.init) {
      const right = this.nextRight(this.left.getRecord());
      if (right !== undefined) {
        this.current = this.left.getRecord().merge(right);
        return true;
      }
    }
    this.init = false;
    this.right.rewind();
    if (this.left.next()) {
      const right = this.nextRight(this.left.getRecord());
      if (right !== undefined) {
        this.current = this.left.getRecord().merge(right);
        return true;
      } else {
        // merge with empty right
        this.current = this.left.getRecord().merge(
          new Record(
            this.right.fields().reduce((previous, current) => {
              previous[current] = null;
              return previous;
            }, {} as any)
          )
        );
        return true;
      }
    } else {
      return false;
    }
  }

  private nextRight(left: Record): Record | undefined {
    while (this.right.next()) {
      if (this.predicate.test(left.merge(this.right.getRecord()))) {
        return this.right.getRecord();
      }
    }
    return undefined;
  }

  getRecord(): Record {
    return this.current as Record;
  }

  rewind(): void {
    this.left.rewind();
    this.right.rewind();
    this.init = true;
  }

  fields(): string[] {
    return [...this.left.fields(), ...this.right.fields()];
  }
}
