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
  GroupByToken,
  IdentifierToken,
  LessThanOrEqualToken,
  LessThanToken,
  LParenToken,
  NumberToken,
  OrderByToken,
  OrToken,
  RParenToken,
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

test('x BETWEEN 1 AND 2', () => {
  const lexer = new SQLLexer('x BETWEEN 1 AND 2');
  const actual = lexer.tokens();
  expect(actual.length).toBe(10);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(GreaterThanOrEqualToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(AndToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(LessThanOrEqualToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(RParenToken.TOKEN);
  expect(actual[9]).toStrictEqual(EOFToken.TOKEN);
});

test('x BETWEEN 1 AND 2 AND a=1 AND y BETWEEN 3 AND 4', () => {
  const lexer = new SQLLexer(
    `x BETWEEN 1 AND 2 AND a=1 AND y BETWEEN 'xxx' AND 'yyy'`
  );
  const actual = lexer.tokens();
  expect(actual.length).toBe(24);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(GreaterThanOrEqualToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(AndToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(LessThanOrEqualToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(RParenToken.TOKEN);

  expect(actual[9]).toStrictEqual(AndToken.TOKEN);
  expect(actual[10]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[11]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[12]).toStrictEqual(new NumberToken('1'));
  expect(actual[13]).toStrictEqual(AndToken.TOKEN);

  expect(actual[14]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[15]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[16]).toStrictEqual(GreaterThanOrEqualToken.TOKEN);
  expect(actual[17]).toStrictEqual(new StringToken('xxx'));
  expect(actual[18]).toStrictEqual(AndToken.TOKEN);
  expect(actual[19]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[20]).toStrictEqual(LessThanOrEqualToken.TOKEN);
  expect(actual[21]).toStrictEqual(new StringToken('yyy'));
  expect(actual[22]).toStrictEqual(RParenToken.TOKEN);
  expect(actual[23]).toStrictEqual(EOFToken.TOKEN);
});

test('SELECT * FROM abc ORDER BY a;', () => {
  const lexer = new SQLLexer('SELECT * FROM abc ORDER BY a;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(7);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(AsteriskToken.TOKEN);
  expect(actual[2]).toStrictEqual(FromToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[4]).toStrictEqual(OrderByToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[6]).toStrictEqual(EOFToken.TOKEN);
});

test('SELECT * FROM abc GROUP BY a,b;', () => {
  const lexer = new SQLLexer('SELECT * FROM abc GROUP BY a,b;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(9);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(AsteriskToken.TOKEN);
  expect(actual[2]).toStrictEqual(FromToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[4]).toStrictEqual(GroupByToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[6]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[7]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[8]).toStrictEqual(EOFToken.TOKEN);
});

test('SELECT * FROM abc GROUP BY a,b ORDER BY a,bb;', () => {
  const lexer = new SQLLexer('SELECT * FROM abc GROUP BY a,b ORDER BY x,y;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(13);
  expect(actual[0]).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1]).toStrictEqual(AsteriskToken.TOKEN);
  expect(actual[2]).toStrictEqual(FromToken.TOKEN);
  expect(actual[3]).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[4]).toStrictEqual(GroupByToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('a'));
  expect(actual[6]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[7]).toStrictEqual(new IdentifierToken('b'));
  expect(actual[8]).toStrictEqual(OrderByToken.TOKEN);
  expect(actual[9]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[10]).toStrictEqual(CommaToken.TOKEN);
  expect(actual[11]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[12]).toStrictEqual(EOFToken.TOKEN);
});

test('x IN (1,2,3)', () => {
  const lexer = new SQLLexer('x IN (1,2,3)');
  const actual = lexer.tokens();
  expect(actual.length).toBe(14);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(OrToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(OrToken.TOKEN);
  expect(actual[9]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[10]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[11]).toStrictEqual(new NumberToken('3'));
  expect(actual[12]).toStrictEqual(RParenToken.TOKEN);
  expect(actual[13]).toStrictEqual(EOFToken.TOKEN);
});

test('x NOT IN (1,2,3)', () => {
  const lexer = new SQLLexer('x NOT IN (1,2,3)');
  const actual = lexer.tokens();
  expect(actual.length).toBe(14);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(AndToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(AndToken.TOKEN);
  expect(actual[9]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[10]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[11]).toStrictEqual(new NumberToken('3'));
  expect(actual[12]).toStrictEqual(RParenToken.TOKEN);
  expect(actual[13]).toStrictEqual(EOFToken.TOKEN);
});

test('x IN (1,2) AND y IN (3,4)', () => {
  const lexer = new SQLLexer('x IN (1,2) AND y IN (3,4)');
  const actual = lexer.tokens();
  expect(actual.length).toBe(20);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(OrToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(RParenToken.TOKEN);

  expect(actual[9]).toStrictEqual(AndToken.TOKEN);

  expect(actual[10]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[11]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[12]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[13]).toStrictEqual(new NumberToken('3'));
  expect(actual[14]).toStrictEqual(OrToken.TOKEN);
  expect(actual[15]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[16]).toStrictEqual(EqualToken.TOKEN);
  expect(actual[17]).toStrictEqual(new NumberToken('4'));
  expect(actual[18]).toStrictEqual(RParenToken.TOKEN);

  expect(actual[19]).toStrictEqual(EOFToken.TOKEN);
});

test('x NOT IN (1,2) AND y IN NOT (3,4)', () => {
  const lexer = new SQLLexer('x NOT IN (1,2) AND y NOT IN (3,4)');
  const actual = lexer.tokens();
  expect(actual.length).toBe(20);
  expect(actual[0]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[1]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[2]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[3]).toStrictEqual(new NumberToken('1'));
  expect(actual[4]).toStrictEqual(AndToken.TOKEN);
  expect(actual[5]).toStrictEqual(new IdentifierToken('x'));
  expect(actual[6]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[7]).toStrictEqual(new NumberToken('2'));
  expect(actual[8]).toStrictEqual(RParenToken.TOKEN);

  expect(actual[9]).toStrictEqual(AndToken.TOKEN);

  expect(actual[10]).toStrictEqual(LParenToken.TOKEN);
  expect(actual[11]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[12]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[13]).toStrictEqual(new NumberToken('3'));
  expect(actual[14]).toStrictEqual(AndToken.TOKEN);
  expect(actual[15]).toStrictEqual(new IdentifierToken('y'));
  expect(actual[16]).toStrictEqual(DiamondToken.TOKEN);
  expect(actual[17]).toStrictEqual(new NumberToken('4'));
  expect(actual[18]).toStrictEqual(RParenToken.TOKEN);

  expect(actual[19]).toStrictEqual(EOFToken.TOKEN);
});

test("SELECT * FROM abc WHERE a='a;", () => {
  const lexer = new SQLLexer("SELECT * FROM abc WHERE a='a;");
  expect(() => lexer.tokens()).toThrowError('Unclosed double-quote.');
});
