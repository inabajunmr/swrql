import { CSVScan } from './csv/csvscan';
import { ProductScan } from './productscan';
import { Record } from './scan';

test('product 2 tables', () => {
  const table1 = new CSVScan(
    'table1',
    `t1a,t1b,t1c
    1,2,3
    a,b,c
    x,y,z`
  );
  const table2 = new CSVScan(
    'table2',
    `t2a,t2b
    foo,bar
    hoge,fuga`
  );

  const sut = new ProductScan(table1, table2);

  assertRecord(sut.getRecord(), '1', '2', '3', 'foo', 'bar');
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), '1', '2', '3', 'hoge', 'fuga');
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), 'a', 'b', 'c', 'foo', 'bar');
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), 'a', 'b', 'c', 'hoge', 'fuga');
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), 'x', 'y', 'z', 'foo', 'bar');
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), 'x', 'y', 'z', 'hoge', 'fuga');
  expect(sut.next()).toBe(false);
});

function assertRecord(
  record: Record,
  t1a: string,
  t1b: string,
  t1c: string,
  t2a: string,
  t2b: string
) {
  expect(record.get('t1a')).toBe(t1a);
  expect(record.get('t1b')).toBe(t1b);
  expect(record.get('t1c')).toBe(t1c);
  expect(record.get('t2a')).toBe(t2a);
  expect(record.get('t2b')).toBe(t2b);
}
