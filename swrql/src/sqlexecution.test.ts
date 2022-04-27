import { CSVScan } from './scan/csv/csvscan';
import { Record } from './scan/scan';
import { SQLExecution } from './sqlexecution';

test('select * from abc;', () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3
x,y,z
foo,bar,baz`
  );
  const sqlExecution = new SQLExecution([table1], 'select * from abc;');
  const actual = sqlExecution.execute();

  assertRecord(actual[0], { a: '1', b: '2', c: '3' });
  assertRecord(actual[1], { a: 'x', b: 'y', c: 'z' });
  assertRecord(actual[2], { a: 'foo', b: 'bar', c: 'baz' });
  expect(actual.length).toBe(3);
});

test('select a,b from abc;', () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3
x,y,z
foo,bar,baz`
  );
  const sqlExecution = new SQLExecution([table1], 'select a,b from abc;');
  const actual = sqlExecution.execute();

  assertRecord(actual[0], { a: '1', b: '2' });
  assertRecord(actual[1], { a: 'x', b: 'y' });
  assertRecord(actual[2], { a: 'foo', b: 'bar' });
  expect(actual.length).toBe(3);
});

test(`select * from abc where a=1 OR b='bar';`, () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3
x,y,z
foo,bar,baz`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    `select * from abc where a=1 OR b='bar';`
  );
  const actual = sqlExecution.execute();
  assertRecord(actual[0], { a: '1', b: '2', c: '3' });
  assertRecord(actual[1], { a: 'foo', b: 'bar', c: 'baz' });
  expect(actual.length).toBe(2);
});

function assertRecord(record: Record, expected: any) {
  Object.keys(expected).forEach((k) => {
    expect(record.get(k)).toBe(expected[k]);
  });
  expect(record.size()).toBe(Object.keys(expected).length);
}
