import { Record } from '../scan/record';
import { SQLParser } from '../sql/parser';

test('a=1', () => {
  const sut = new SQLParser('SELECT * FROM abc WHERE a=1;').parse().where;
  expect(sut.test(new Record({ a: '1' }))).toBe(true);
  expect(sut.test(new Record({ a: '2' }))).toBe(false);
});

test(`a='abc'`, () => {
  const sut = new SQLParser(`SELECT * FROM abc WHERE a='abc';`).parse().where;
  expect(sut.test(new Record({ a: 'abc' }))).toBe(true);
  expect(sut.test(new Record({ a: 'def' }))).toBe(false);
});

test(`a=1 AND b=2`, () => {
  const sut = new SQLParser(`SELECT * FROM abc WHERE a=1 AND b=2;`).parse()
    .where;
  expect(sut.test(new Record({ a: '1', b: '2' }))).toBe(true);
  expect(sut.test(new Record({ a: '1', b: '3' }))).toBe(false);
  expect(sut.test(new Record({ a: '3', b: '2' }))).toBe(false);
});

test(`a=1 OR b=2`, () => {
  const sut = new SQLParser(`SELECT * FROM abc WHERE a=1 OR b=2;`).parse()
    .where;
  expect(sut.test(new Record({ a: '1', b: '2' }))).toBe(true);
  expect(sut.test(new Record({ a: '1', b: '3' }))).toBe(true);
  expect(sut.test(new Record({ a: '3', b: '2' }))).toBe(true);
  expect(sut.test(new Record({ a: '23', b: '3' }))).toBe(false);
});

test(`a=1 OR b=2 AND c=3`, () => {
  const sut = new SQLParser(
    `SELECT * FROM abc WHERE a=1 OR b=2 AND c=3;`
  ).parse().where;
  expect(sut.test(new Record({ a: '1', b: '2', c: '3' }))).toBe(true);
  expect(sut.test(new Record({ a: '1', b: '3', c: '4' }))).toBe(true);
  expect(sut.test(new Record({ a: '2', b: '2', c: '3' }))).toBe(true);
  expect(sut.test(new Record({ a: '2', b: '2', c: '4' }))).toBe(false);
});

test(`a=1 OR b='bar';`, () => {
  const sut = new SQLParser(`SELECT * FROM abc WHERE a=1 OR b='bar';`).parse()
    .where;
  expect(sut.test(new Record({ a: 'foo', b: 'bar', c: 'baz' }))).toBe(true);
});

test('a>1', () => {
  const sut = new SQLParser('SELECT * FROM abc WHERE a>1;').parse().where;
  expect(sut.test(new Record({ a: '1' }))).toBe(false);
  expect(sut.test(new Record({ a: '2' }))).toBe(true);
});
