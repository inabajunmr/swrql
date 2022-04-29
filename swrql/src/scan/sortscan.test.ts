import { SQLParser } from '../sql/parser';
import { CSVScan } from './csv/csvscan';
import { Record } from './record';
import { SortScan } from './sortscan';

test(`single sortKey and ASC';`, () => {
  const csv = new CSVScan(
    'abc',
    `a,b,c
        2,b,c
    3,2,3
    1,y,z
    4,bar,baz`
  );

  const actual = new SortScan(csv, ['a'], true);
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '1', b: 'y', c: 'z' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '2', b: 'b', c: 'c' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '3', b: '2', c: '3' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '4', b: 'bar', c: 'baz' });
  expect(actual.next()).toBe(false);
});

test(`single sortKey and DESC';`, () => {
  const csv = new CSVScan(
    'abc',
    `a,b,c
        2,b,c
    3,2,3
    1,y,z
    4,bar,baz`
  );

  const actual = new SortScan(csv, ['a'], false);
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '4', b: 'bar', c: 'baz' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '3', b: '2', c: '3' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '2', b: 'b', c: 'c' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '1', b: 'y', c: 'z' });
  expect(actual.next()).toBe(false);
});

test(`multiple sortKey and ASC';`, () => {
  const csv = new CSVScan(
    'abc',
    `a,b,c
        2,2,1
        1,2,1
        1,1,1
        2,1,1
        1,3,1
        2,3,1`
  );

  const actual = new SortScan(csv, ['a', 'b'], true);
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '1', b: '1', c: '1' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '1', b: '2', c: '1' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '1', b: '3', c: '1' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '2', b: '1', c: '1' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '2', b: '2', c: '1' });
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), { a: '2', b: '3', c: '1' });
  expect(actual.next()).toBe(false);
});

function assertRecord(record: Record, expected: any) {
  Object.keys(expected).forEach((k) => {
    expect(record.get(k)).toBe(expected[k]);
  });
  expect(record.size()).toBe(Object.keys(expected).length);
}
