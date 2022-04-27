import { SQLParser } from './parser';
import {
  AndToken,
  EqualToken,
  IdentifierToken,
  NumberToken,
  OrToken,
  StringToken,
} from './token';

test('SELECT * FROM abc;', () => {
  const parser = new SQLParser('SELECT * FROM abc;');
  const actual = parser.parse();
  expect(actual.fields).toContain('*');
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc WHERE a=1;', () => {
  const parser = new SQLParser('SELECT * FROM abc WHERE a=1;');
  const actual = parser.parse();
  expect(actual.fields).toContain('*');
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
});

test(`SELECT a,b,c FROM abc WHERE a=1 AND b='abc';`, () => {
  const parser = new SQLParser(`SELECT a,b,c FROM abc WHERE a=1 AND b='abc';`);
  const actual = parser.parse();
  expect(actual.fields).toHaveLength(3);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('c');
  expect(actual.tables[0]).toContain('abc');

  // a 1 = b 'abc' = AND
  expect(actual.where.tokens).toHaveLength(7);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens[3]).toStrictEqual(new IdentifierToken('b'));
  expect(actual.where.tokens[4]).toStrictEqual(new StringToken('abc'));
  expect(actual.where.tokens[5]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens[6]).toStrictEqual(AndToken.TOKEN);
});

test(`SELECT a,b,c FROM abc WHERE a=1 AND (b='abc' OR c=2);`, () => {
  const parser = new SQLParser(
    `SELECT a,b,c FROM abc WHERE a=1 AND (b='abc' OR c=2);`
  );
  const actual = parser.parse();
  expect(actual.fields).toHaveLength(3);
  expect(actual.fields).toContain('a');
  expect(actual.fields).toContain('b');
  expect(actual.fields).toContain('c');
  expect(actual.tables[0]).toContain('abc');

  // a 1 = b abc = c 2 = OR AND
  expect(actual.where.tokens).toHaveLength(11);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens[3]).toStrictEqual(new IdentifierToken('b'));
  expect(actual.where.tokens[4]).toStrictEqual(new StringToken('abc'));
  expect(actual.where.tokens[5]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens[6]).toStrictEqual(new IdentifierToken('c'));
  expect(actual.where.tokens[7]).toStrictEqual(new NumberToken('2'));
  expect(actual.where.tokens[8]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens[9]).toStrictEqual(OrToken.TOKEN);
  expect(actual.where.tokens[10]).toStrictEqual(AndToken.TOKEN);
});
