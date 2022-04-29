import { SQLParser } from '../sql/parser';
import { SelectScan } from './selectscan';
import { CSVScan } from './csv/csvscan';
import { Record } from './record';

test(`select * from abc where a=1 OR b='bar';`, () => {
  const selectData = new SQLParser(
    `select * from abc where a=1 OR b='bar';`
  ).parse();
  const csv = new CSVScan(
    'abc',
    `a,b,c
  1,2,3
  x,y,z
  foo,bar,baz`
  );

  const actual = new SelectScan(csv, selectData.where);
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), '1', '2', '3');
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), 'foo', 'bar', 'baz');
  expect(actual.next()).toBe(false);
});

test(`SELECT * FROM abc WHERE a=1 OR b=2 AND c=3;`, () => {
  const selectData = new SQLParser(
    `SELECT * FROM abc WHERE a=1 OR b=2 AND c=3;`
  ).parse();
  const csv = new CSVScan(
    'table',
    `a,b,c
1,2,3
1,3,4
2,3,3
2,2,4
2,2,3`
  );
  const actual = new SelectScan(csv, selectData.where);
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), '1', '2', '3');
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), '1', '3', '4');
  expect(actual.next()).toBe(true);
  assertRecord(actual.getRecord(), '2', '2', '3');
  expect(actual.next()).toBe(false);
});

function assertRecord(record: Record, a: string, b: string, c: string) {
  expect(record.get('a')).toBe(a);
  expect(record.get('b')).toBe(b);
  expect(record.get('c')).toBe(c);
}
