import { CSVScan } from './scan/csv/csvscan';
import { Record } from './scan/record';
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

  assertRecord(actual.records[0], { a: '1', b: '2', c: '3' });
  assertRecord(actual.records[1], { a: 'x', b: 'y', c: 'z' });
  assertRecord(actual.records[2], { a: 'foo', b: 'bar', c: 'baz' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(3);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('c');
});

test('select * from a order by a;', () => {
  const table1 = new CSVScan(
    'a',
    `a
1
3
2`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select * from a order by a;'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '1' });
  assertRecord(actual.records[1], { a: '2' });
  assertRecord(actual.records[2], { a: '3' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(1);
  expect(actual.fields).toContain('a');
});

test('select * from a where a between 3 and 5;', () => {
  const table1 = new CSVScan(
    'a',
    `a
1
2
3
4
5
6`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select * from a where a between 3 and 5;'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '3' });
  assertRecord(actual.records[1], { a: '4' });
  assertRecord(actual.records[2], { a: '5' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(1);
  expect(actual.fields).toContain('a');
});

test('select * from a where a in(1,3,5);', () => {
  const table1 = new CSVScan(
    'a',
    `a
1
2
3
4
5
6`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select * from a where a in(1,3,5);'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '1' });
  assertRecord(actual.records[1], { a: '3' });
  assertRecord(actual.records[2], { a: '5' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(1);
  expect(actual.fields).toContain('a');
});

test('select * from a where a not in(1,3,5);', () => {
  const table1 = new CSVScan(
    'a',
    `a
1
2
3
4
5
6`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select * from a where a not in(1,3,5);'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '2' });
  assertRecord(actual.records[1], { a: '4' });
  assertRecord(actual.records[2], { a: '6' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(1);
  expect(actual.fields).toContain('a');
});

test(`select * from a where a like '^[a-z]+$';`, () => {
  const table1 = new CSVScan(
    'a',
    `a
abc
abc1
xyz
hello
1abc`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    `select * from a where a like '^[a-z]+$';`
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: 'abc' });
  assertRecord(actual.records[1], { a: 'xyz' });
  assertRecord(actual.records[2], { a: 'hello' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(1);
  expect(actual.fields).toContain('a');
});

test('select * from a,b;', () => {
  const table1 = new CSVScan(
    'a',
    `a
1
x`
  );
  const table2 = new CSVScan(
    'b',
    `b
2
y`
  );
  const sqlExecution = new SQLExecution([table1, table2], 'select * from a,b;');
  const actual = sqlExecution.execute();
  expect(actual.records.length).toBe(4);
  assertRecord(actual.records[0], { a: '1', b: '2' });
  assertRecord(actual.records[1], { a: '1', b: 'y' });
  assertRecord(actual.records[2], { a: 'x', b: '2' });
  assertRecord(actual.records[3], { a: 'x', b: 'y' });
  expect(actual.fields.length).toBe(2);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
});

test('select * from a join b on a=b;', () => {
  const table1 = new CSVScan(
    'a',
    `a,x
1,3
2,4
3,5
4,6
5,7
5,8`
  );
  const table2 = new CSVScan(
    'b',
    `b,y
3,1
4,2
5,1`
  );
  const sqlExecution = new SQLExecution(
    [table1, table2],
    'select * from a join b on a=b where y=1;'
  );
  const actual = sqlExecution.execute();
  expect(actual.records.length).toBe(3);
  assertRecord(actual.records[0], { a: '3', x: '5', b: '3', y: '1' });
  assertRecord(actual.records[1], { a: '5', x: '7', b: '5', y: '1' });
  assertRecord(actual.records[2], { a: '5', x: '8', b: '5', y: '1' });
  expect(actual.fields.length).toBe(4);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('x');
  expect(actual.fields).toContain('y');
});

test('select * from a inner join b on a=b;', () => {
  const table1 = new CSVScan(
    'a',
    `a,x
1,3
2,4
3,5
4,6
5,7
5,8`
  );
  const table2 = new CSVScan(
    'b',
    `b,y
3,1
4,2
5,1`
  );
  const sqlExecution = new SQLExecution(
    [table1, table2],
    'select * from a inner join b on a=b where y=1;'
  );
  const actual = sqlExecution.execute();
  expect(actual.records.length).toBe(3);
  assertRecord(actual.records[0], { a: '3', x: '5', b: '3', y: '1' });
  assertRecord(actual.records[1], { a: '5', x: '7', b: '5', y: '1' });
  assertRecord(actual.records[2], { a: '5', x: '8', b: '5', y: '1' });
  expect(actual.fields.length).toBe(4);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('x');
  expect(actual.fields).toContain('y');
});

test('select * from a left outer join b on a=b;', () => {
  const table1 = new CSVScan(
    'a',
    `a,x
1,3
2,4
3,5
4,6
5,7
5,8`
  );
  const table2 = new CSVScan(
    'b',
    `b,y
3,1
4,2
5,1
5,2`
  );
  const sqlExecution = new SQLExecution(
    [table1, table2],
    'select * from a left outer join b on a=b;'
  );
  const actual = sqlExecution.execute();
  expect(actual.records.length).toBe(8);
  assertRecord(actual.records[0], { a: '1', x: '3', b: null, y: null });
  assertRecord(actual.records[1], { a: '2', x: '4', b: null, y: null });
  assertRecord(actual.records[2], { a: '3', x: '5', b: '3', y: '1' });
  assertRecord(actual.records[3], { a: '4', x: '6', b: '4', y: '2' });
  assertRecord(actual.records[4], { a: '5', x: '7', b: '5', y: '1' });
  assertRecord(actual.records[5], { a: '5', x: '7', b: '5', y: '2' });
  assertRecord(actual.records[6], { a: '5', x: '8', b: '5', y: '1' });
  assertRecord(actual.records[7], { a: '5', x: '8', b: '5', y: '2' });
  expect(actual.fields.length).toBe(4);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('x');
  expect(actual.fields).toContain('y');
});

test('select * from b right outer join a on a=b;', () => {
  const table1 = new CSVScan(
    'a',
    `a,x
1,3
2,4
3,5
4,6
5,7
5,8`
  );
  const table2 = new CSVScan(
    'b',
    `b,y
3,1
4,2
5,1
5,2`
  );
  const sqlExecution = new SQLExecution(
    [table1, table2],
    'select * from b right outer join a on a=b;'
  );
  const actual = sqlExecution.execute();
  expect(actual.records.length).toBe(8);
  assertRecord(actual.records[0], { a: '1', x: '3', b: null, y: null });
  assertRecord(actual.records[1], { a: '2', x: '4', b: null, y: null });
  assertRecord(actual.records[2], { a: '3', x: '5', b: '3', y: '1' });
  assertRecord(actual.records[3], { a: '4', x: '6', b: '4', y: '2' });
  assertRecord(actual.records[4], { a: '5', x: '7', b: '5', y: '1' });
  assertRecord(actual.records[5], { a: '5', x: '7', b: '5', y: '2' });
  assertRecord(actual.records[6], { a: '5', x: '8', b: '5', y: '1' });
  assertRecord(actual.records[7], { a: '5', x: '8', b: '5', y: '2' });
  expect(actual.fields.length).toBe(4);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('x');
  expect(actual.fields).toContain('y');
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

  assertRecord(actual.records[0], { a: '1', b: '2' });
  assertRecord(actual.records[1], { a: 'x', b: 'y' });
  assertRecord(actual.records[2], { a: 'foo', b: 'bar' });
  expect(actual.records.length).toBe(3);
});

test('select * from abc where a >= 2;', () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3
2,3,4
3,4,5`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select * from abc where a >= 2;'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '2', b: '3', c: '4' });
  assertRecord(actual.records[1], { a: '3', b: '4', c: '5' });
  expect(actual.records.length).toBe(2);
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
  assertRecord(actual.records[0], { a: '1', b: '2', c: '3' });
  assertRecord(actual.records[1], { a: 'foo', b: 'bar', c: 'baz' });
  expect(actual.records.length).toBe(2);
});

test('select a,count(*) from abc group by a;', () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
    1,2,3
    1,3,4
    1,4,5
    2,1,2
    2,2,3
    3,1,2`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    'select a,count(*) from abc group by a;'
  );
  const actual = sqlExecution.execute();
  assertRecord(actual.records[0], { a: '1', 'count(*)': '3' });
  assertRecord(actual.records[1], { a: '2', 'count(*)': '2' });
  assertRecord(actual.records[2], { a: '3', 'count(*)': '1' });
  expect(actual.records.length).toBe(3);
  expect(actual.fields.length).toBe(2);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('count(*)');
});

test(`FROM clause has unknown table name`, () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    `select * from xyz where a=1 OR b='bar';`
  );
  expect(() => sqlExecution.execute()).toThrowError('xyz is not found.');
});

test(`FROM clause has unknown table name2`, () => {
  const table1 = new CSVScan(
    'abc',
    `a,b,c
1,2,3`
  );
  const sqlExecution = new SQLExecution(
    [table1],
    `select * from abc,xyz where a=1 OR b='bar';`
  );
  expect(() => sqlExecution.execute()).toThrowError('xyz is not found.');
});

function assertRecord(record: Record, expected: any) {
  Object.keys(expected).forEach((k) => {
    expect(record.get(k)).toBe(expected[k]);
  });
  expect(record.size()).toBe(Object.keys(expected).length);
}
