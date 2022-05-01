import { Predicate } from '../predicate/predicate';
import { EqualToken, IdentifierToken } from '../sql/token';
import { CSVScan } from './csv/csvscan';
import { OuterJoinScan } from './outerjoinscan';
import { Record } from './record';

test('outerjoin', () => {
  const table1 = new CSVScan(
    'table1',
    `t1a,t1b
        1,2
        2,3
        3,4
        4,5
        4,6
        5,7`
  );
  const table2 = new CSVScan(
    'table2',
    `t2a,t2b
      1,a
      x,y
      y,b
      3,c
      3,d
      4,e`
  );

  const sut = new OuterJoinScan(
    table1,
    table2,
    new Predicate([
      new IdentifierToken('t1a'),
      new IdentifierToken('t2a'),
      EqualToken.TOKEN,
    ])
  );
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '1', t2a: '1', t1b: '2', t2b: 'a' });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '2', t2a: null, t1b: '3', t2b: null });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '3', t2a: '3', t1b: '4', t2b: 'c' });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '3', t2a: '3', t1b: '4', t2b: 'd' });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '4', t2a: '4', t1b: '5', t2b: 'e' });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '4', t2a: '4', t1b: '6', t2b: 'e' });
  expect(sut.next()).toBe(true);
  assertRecord(sut.getRecord(), { t1a: '5', t2a: null, t1b: '7', t2b: null });
});

function assertRecord(record: Record, expected: any) {
  Object.keys(expected).forEach((k) => {
    expect(record.get(k)).toBe(expected[k]);
  });
  expect(record.size()).toBe(Object.keys(expected).length);
}
