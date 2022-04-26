import { Record } from '../scan';
import { CSVScan } from './csvscan';

test('CSV Scan', () => {
  const sut = new CSVScan(
    'table',
    `a,   b,      c, abc, bcd, cde
                          1,   2,      3, 123, 456, 789
                          foo,bar,foobar,hoge,fuga,piyo`
  );
  assertRecord(sut.getRecord(), ['1', '2', '3', '123', '456', '789']);
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), [
    'foo',
    'bar',
    'foobar',
    'hoge',
    'fuga',
    'piyo',
  ]);
  expect(sut.next()).toBe(false);
});

function assertRecord(record: Record, expected: string[]) {
  expect(record.get('a')).toBe(expected[0]);
  expect(record.get('b')).toBe(expected[1]);
  expect(record.get('c')).toBe(expected[2]);
  expect(record.get('abc')).toBe(expected[3]);
  expect(record.get('cde')).toBe(expected[5]);
  expect(record.get('bcd')).toBe(expected[4]);
}
