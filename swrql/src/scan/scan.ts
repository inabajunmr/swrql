import { Record } from './record';

export interface Scan {
  next(): boolean;
  getRecord(): Record;
  rewind(): void;
  fields(): string[];
}
