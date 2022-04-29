import { SQLLexer } from './lexer';
import {
  AndToken,
  AsteriskToken,
  CommaToken,
  DiamondToken,
  EOFToken,
  EqualToken,
  FromToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  IdentifierToken,
  LessThanOrEqualToken,
  LessThanToken,
  NumberToken,
  SelectToken,
  StringToken,
  WhereToken,
} from './token';

test('SELECT * FROM abc;', () => {
  const lexer = new SQLLexer('SELECT * FROM abc;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(5);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(AsteriskToken.TOKEN);
  expect(actual[2]).toStrictEqual(FromToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[4]).toStrictEqual(EOFToken.TOKEN);
});

test('SELECT AAA,B123,C_C FROM abc;', () => {
  const lexer = new SQLLexer('SELECT AAA,B123,C_C FROM abc;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(9);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('AAA'));
  expect(actual[2]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('B123'));
  expect(actual[4]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('C_C'));
  expect(actual[6]).toStrictEqual(FromToken.TOKEN);
  expect(actual[7]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[8]).toStrictEqual(EOFToken.TOKEN);
});

test("SELECT AAA,B123,C_C FROM abc WHERE a=1 AND b='abc';", () => {
  const lexer = new SQLLexer(
    "SELECT AAA,B123,C_C FROM abc WHERE a=1 AND b='abc';"
  );
  const actual = lexer.tokens();
  expect(actual.length).toBe(17);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('AAA'));
  expect(actual[2]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('B123'));
  expect(actual[4]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('C_C'));
  expect(actual[6]).toStrictEqual(FromToken.TOKEN);
  expect(actual[7]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[8]).toStrictEqual(WhereToken.TOKEN);
  expect(actual[9]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[10]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[11]).toStrictEqual(new NumberToken('1'));
  expect(actual[12]).toStrictEqual(AndToken.TOKEN);
  expect(actual[13]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[14]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[15]).toStrictEqual(new StringToken('abc'));
  expect(actual[16]).toStrictEqual(EOFToken.TOKEN);
});

test('a < b', () => {
  const lexer = new SQLLexer('a < b');
  const actual = lexer.tokens();
  expect(actual.length).toBe(4);
  expect(actual[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[1]).toStrictEqual(LessThanToken.TOKEN);
  expect(actual[2]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[3]).toStrictEqual(EOFToken.TOKEN);
});

test('a <= b', () => {
  const lexer = new SQLLexer('a <= b');
  const actual = lexer.tokens();
  expect(actual.length).toBe(4);
  expect(actual[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[1]).toStrictEqual(LessThanOrEqualToken.TOKEN);
  expect(actual[2]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[3]).toStrictEqual(EOFToken.TOKEN);
});

test('a > b', () => {
  const lexer = new SQLLexer('a > b');
  const actual = lexer.tokens();
  expect(actual.length).toBe(4);
  expect(actual[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[1]).toStrictEqual(GreaterThanToken.TOKEN);
  expect(actual[2]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[3]).toStrictEqual(EOFToken.TOKEN);
});

test('a >= b', () => {
  const lexer = new SQLLexer('a >= b');
  const actual = lexer.tokens();
  expect(actual.length).toBe(4);
  expect(actual[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[1]).toStrictEqual(GreaterThanOrEqualToken.TOKEN);
  expect(actual[2]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[3]).toStrictEqual(EOFToken.TOKEN);
});

test('a <> b', () => {
  const lexer = new SQLLexer('a <> b');
  const actual = lexer.tokens();
  expect(actual.length).toBe(4);
  expect(actual[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[1]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[2]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[3]).toStrictEqual(EOFToken.TOKEN);
});

test("SELECT * FROM abc WHERE a='a;", () => {
  const lexer = new SQLLexer("SELECT * FROM abc WHERE a='a;");
  expect(() => lexer.tokens()).toThrowError('Unclosed double-quote.');
});
