import { SQLLexer } from './lexer';
import {
  AndToken,
  AsteriskToken,
  CommaToken,
  EOFToken,
  EqualToken,
  FromToken,
  IdentifierToken,
  NumberToken,
  SelectToken,
  StringToken,
  WhereToken,
} from './token';

test('SELECT * FROM abc;', () => {
  const lexer = new SQLLexer('SELECT * FROM abc;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(5);
  expect(actual[0].get()).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1].get()).toStrictEqual(AsteriskToken.TOKEN);
  expect(actual[2].get()).toStrictEqual(FromToken.TOKEN);
  expect(actual[3].get()).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[4].get()).toStrictEqual(EOFToken.TOKEN);
});

test('SELECT AAA,B123,C_C FROM abc;', () => {
  const lexer = new SQLLexer('SELECT AAA,B123,C_C FROM abc;');
  const actual = lexer.tokens();
  expect(actual.length).toBe(9);
  expect(actual[0].get()).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1].get()).toStrictEqual(new IdentifierToken('AAA'));
  expect(actual[2].get()).toStrictEqual(CommaToken.TOKEN);
  expect(actual[3].get()).toStrictEqual(new IdentifierToken('B123'));
  expect(actual[4].get()).toStrictEqual(CommaToken.TOKEN);
  expect(actual[5].get()).toStrictEqual(new IdentifierToken('C_C'));
  expect(actual[6].get()).toStrictEqual(FromToken.TOKEN);
  expect(actual[7].get()).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[8].get()).toStrictEqual(EOFToken.TOKEN);
});

test("SELECT AAA,B123,C_C FROM abc WHERE a=1 AND b='abc';", () => {
  const lexer = new SQLLexer(
    "SELECT AAA,B123,C_C FROM abc WHERE a=1 AND b='abc';"
  );
  const actual = lexer.tokens();
  expect(actual.length).toBe(17);
  expect(actual[0].get()).toStrictEqual(SelectToken.TOKEN);
  expect(actual[1].get()).toStrictEqual(new IdentifierToken('AAA'));
  expect(actual[2].get()).toStrictEqual(CommaToken.TOKEN);
  expect(actual[3].get()).toStrictEqual(new IdentifierToken('B123'));
  expect(actual[4].get()).toStrictEqual(CommaToken.TOKEN);
  expect(actual[5].get()).toStrictEqual(new IdentifierToken('C_C'));
  expect(actual[6].get()).toStrictEqual(FromToken.TOKEN);
  expect(actual[7].get()).toStrictEqual(new IdentifierToken('abc'));
  expect(actual[8].get()).toStrictEqual(WhereToken.TOKEN);
  expect(actual[9].get()).toStrictEqual(new IdentifierToken('a'));
  expect(actual[10].get()).toStrictEqual(EqualToken.TOKEN);
  expect(actual[11].get()).toStrictEqual(new NumberToken('1'));
  expect(actual[12].get()).toStrictEqual(AndToken.TOKEN);
  expect(actual[13].get()).toStrictEqual(new IdentifierToken('b'));
  expect(actual[14].get()).toStrictEqual(EqualToken.TOKEN);
  expect(actual[15].get()).toStrictEqual(new StringToken('abc'));
  expect(actual[16].get()).toStrictEqual(EOFToken.TOKEN);
});
