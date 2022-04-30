import { SelectFunction, SQLParser } from '../sql/parser';
import { CSVScan } from './csv/csvscan';
import { GroupScan } from './groupscan';
import { Record } from './record';

test('single column count', () => {
  const csv = new CSVScan(
    'abc',
    `a,b,c
            a,1,2
            a,3,4
            b,7,8
            a,2,3
            c,9,10
            d,11,12
            b,5,6
            d,13,14`
  );

  const groupScan = new GroupScan(
    csv,
    ['a'],
    [new SelectFunction('count', '*')]
  );
  expect(groupScan.fields()).toHaveLength(2);
  expect(groupScan.fields()[0]).toBe('a');
  expect(groupScan.fields()[1]).toBe('count(*)');
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'a', 'count(*)': '3' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'b', 'count(*)': '2' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'c', 'count(*)': '1' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'd', 'count(*)': '2' });
  expect(groupScan.next()).toBe(false);
});

test('multiple column count', () => {
  const csv = new CSVScan(
    'abc',
    `a,b,c
            a,1,2
            a,1,3
            a,3,4
            b,5,6
            b,5,8
            c,9,10
            d,11,12
            d,13,14`
  );

  const groupScan = new GroupScan(
    csv,
    ['a', 'b'],
    [new SelectFunction('count', '*')]
  );
  expect(groupScan.fields()).toHaveLength(3);
  expect(groupScan.fields()[0]).toBe('a');
  expect(groupScan.fields()[1]).toBe('b');
  expect(groupScan.fields()[2]).toBe('count(*)');
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'a', b: '1', 'count(*)': '2' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'a', b: '3', 'count(*)': '1' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'b', b: '5', 'count(*)': '2' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'c', b: '9', 'count(*)': '1' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'd', b: '11', 'count(*)': '1' });
  expect(groupScan.next()).toBe(true);
  assertRecord(groupScan.getRecord(), { a: 'd', b: '13', 'count(*)': '1' });
  expect(groupScan.next()).toBe(false);
});

function assertRecord(record: Record, expected: any) {
  Object.keys(expected).forEach((k) => {
    expect(record.get(k)).toBe(expected[k]);
  });
  expect(record.size()).toBe(Object.keys(expected).length);
}