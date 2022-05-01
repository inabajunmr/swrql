import { Predicate } from '../predicate/predicate';
import { JoinTable, SelectField, SelectFunction, SQLParser } from './parser';
import {
  AndToken,
  EqualToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  IdentifierToken,
  NumberToken,
  OrToken,
  StringToken,
} from './token';

test('SELECT * FROM abc;', () => {
  const parser = new SQLParser('SELECT * FROM abc;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.tables).toHaveLength(1);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc,def;', () => {
  const parser = new SQLParser('SELECT * FROM abc,def;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable('product', 'def', undefined, undefined)
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc JOIN def ON a=b;', () => {
  const parser = new SQLParser('SELECT * FROM abc JOIN def ON a=b;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'inner',
      'def',
      undefined,
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc LEFT JOIN def ON a=b;', () => {
  const parser = new SQLParser('SELECT * FROM abc LEFT JOIN def ON a=b;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'outer',
      'def',
      'left',
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc LEFT OUTER JOIN def ON a=b;', () => {
  const parser = new SQLParser('SELECT * FROM abc LEFT OUTER JOIN def ON a=b;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'outer',
      'def',
      'left',
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc RIGHT JOIN def ON a=b;', () => {
  const parser = new SQLParser('SELECT * FROM abc RIGHT JOIN def ON a=b;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'outer',
      'def',
      'right',
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc RIGHT OUTER JOIN def ON a=b;', () => {
  const parser = new SQLParser(
    'SELECT * FROM abc RIGHT OUTER JOIN def ON a=b;'
  );
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'outer',
      'def',
      'right',
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT * FROM abc JOIN def ON a=b ORDER BY a;', () => {
  const parser = new SQLParser('SELECT * FROM abc JOIN def ON a=b ORDER BY a;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toStrictEqual('abc');
  expect(actual.tables[1]).toStrictEqual(
    new JoinTable(
      'inner',
      'def',
      undefined,
      new Predicate([
        new IdentifierToken('a'),
        new IdentifierToken('b'),
        EqualToken.TOKEN,
      ])
    )
  );
  expect(actual.tables).toHaveLength(2);
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey.length).toBe(1);
});

test('SELECT count(*) FROM abc;', () => {
  const parser = new SQLParser('SELECT count(*) FROM abc;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectFunction('count', '*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
});

test('SELECT a, count(*) FROM abc ORDER BY a,b;', () => {
  const parser = new SQLParser('SELECT a, count(*) FROM abc ORDER BY a,b;;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('a'));
  expect(actual.fields[1]).toStrictEqual(new SelectFunction('count', '*'));
  expect(actual.fields.length).toBe(2);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey[1]).toContain('b');
  expect(actual.sortKey.length).toBe(2);
});

test('SELECT a, count(*) FROM abc WHERE c=1 ORDER BY a,b;', () => {
  const parser = new SQLParser(
    'SELECT a, count(*) FROM abc WHERE c=1 ORDER BY a,b;'
  );
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('a'));
  expect(actual.fields[1]).toStrictEqual(new SelectFunction('count', '*'));
  expect(actual.fields.length).toBe(2);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('c'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey[1]).toContain('b');
  expect(actual.sortKey.length).toBe(2);
});

test('SELECT * FROM abc ORDER BY a,b,c;', () => {
  const parser = new SQLParser('SELECT * FROM abc ORDER BY a,b,c;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey[1]).toContain('b');
  expect(actual.sortKey[2]).toContain('c');
  expect(actual.sortKey.length).toBe(3);
  expect(actual.isAsc).toBe(true);
});

test('SELECT * FROM abc GROUP BY a,b,c;', () => {
  const parser = new SQLParser('SELECT * FROM abc GROUP BY a,b,c;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.groupByKeys[0]).toContain('a');
  expect(actual.groupByKeys[1]).toContain('b');
  expect(actual.groupByKeys[2]).toContain('c');
  expect(actual.groupByKeys.length).toBe(3);
  expect(actual.sortKey.length).toBe(0);
  expect(actual.isAsc).toBe(true);
});

test('SELECT * FROM abc GROUP BY a,b,c ORDER BY x,y;', () => {
  const parser = new SQLParser(
    'SELECT * FROM abc GROUP BY a,b,c ORDER BY x,y;'
  );
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.groupByKeys[0]).toContain('a');
  expect(actual.groupByKeys[1]).toContain('b');
  expect(actual.groupByKeys[2]).toContain('c');
  expect(actual.groupByKeys.length).toBe(3);
  expect(actual.sortKey[0]).toContain('x');
  expect(actual.sortKey[1]).toContain('y');
  expect(actual.sortKey.length).toBe(2);
  expect(actual.isAsc).toBe(true);
});

test('SELECT * FROM abc ORDER BY a,b,c DESC;', () => {
  const parser = new SQLParser('SELECT * FROM abc ORDER BY a,b,c DESC;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(0);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey[1]).toContain('b');
  expect(actual.sortKey[2]).toContain('c');
  expect(actual.sortKey.length).toBe(3);
  expect(actual.isAsc).toBe(false);
});

test('SELECT * FROM abc WHERE a=1;', () => {
  const parser = new SQLParser('SELECT * FROM abc WHERE a=1;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
});

test('SELECT * FROM abc WHERE a=1 ORDER BY a,b,c DESC;', () => {
  const parser = new SQLParser(
    'SELECT * FROM abc WHERE a=1 ORDER BY a,b,c DESC;'
  );
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(EqualToken.TOKEN);
  expect(actual.sortKey[0]).toContain('a');
  expect(actual.sortKey[1]).toContain('b');
  expect(actual.sortKey[2]).toContain('c');
  expect(actual.sortKey.length).toBe(3);
  expect(actual.isAsc).toBe(false);
});

test('SELECT * FROM abc WHERE a > 1;', () => {
  const parser = new SQLParser('SELECT * FROM abc WHERE a > 1;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(GreaterThanToken.TOKEN);
});

test('SELECT * FROM abc WHERE a >= 1;', () => {
  const parser = new SQLParser('SELECT * FROM abc WHERE a >= 1;');
  const actual = parser.parse();
  expect(actual.fields[0]).toStrictEqual(new SelectField('*'));
  expect(actual.fields.length).toBe(1);
  expect(actual.tables[0]).toContain('abc');
  expect(actual.where.tokens).toHaveLength(3);
  expect(actual.where.tokens[0]).toStrictEqual(new IdentifierToken('a'));
  expect(actual.where.tokens[1]).toStrictEqual(new NumberToken('1'));
  expect(actual.where.tokens[2]).toStrictEqual(GreaterThanOrEqualToken.TOKEN);
});

test(`SELECT a,b,c FROM abc WHERE a=1 AND b='abc';`, () => {
  const parser = new SQLParser(`SELECT a,b,c FROM abc WHERE a=1 AND b='abc';`);
  const actual = parser.parse();
  expect(actual.fields).toHaveLength(3);
  expect(actual.fields[0]).toStrictEqual(new SelectField('a'));
  expect(actual.fields[1]).toStrictEqual(new SelectField('b'));
  expect(actual.fields[2]).toStrictEqual(new SelectField('c'));
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
  expect(actual.fields[0]).toStrictEqual(new SelectField('a'));
  expect(actual.fields[1]).toStrictEqual(new SelectField('b'));
  expect(actual.fields[2]).toStrictEqual(new SelectField('c'));
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

test(`No SELECT clause`, () => {
  const parser = new SQLParser(
    `a,b,c FROM abc WHERE a=1 AND (b='abc' OR c=2);`
  );
  expect(() => parser.parse()).toThrowError('Query needs SELECT clause.');
});

test(`No FROM clause`, () => {
  const parser = new SQLParser(
    `SELECT a,b,c abc WHERE a=1 AND (b='abc' OR c=2);`
  );
  expect(() => parser.parse()).toThrowError(
    'Field list at SELECT clause is something wrong.'
  );
});
