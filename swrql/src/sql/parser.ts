import { Predicate } from '../predicate/predicate';
import { SQLLexer } from './lexer';
import { getInputPriority, getStackPriority } from './shunting-yard';
import {
  AsteriskToken,
  CommaToken,
  EOFToken,
  FromToken,
  IdentifierToken,
  LParenToken,
  OrderByToken,
  RParenToken,
  SelectToken,
  Token,
  WhereToken,
} from './token';

export class SQLParser {
  private tokens: Token[];
  constructor(sql: string) {
    this.tokens = new SQLLexer(sql).tokens();
  }

  parse(): SelectData {
    // SELECT
    if (!(this.tokens.shift() instanceof SelectToken)) {
      throw new Error('Query needs SELECT clause.');
    }

    // FIELDS
    const fields: string[] = [];
    {
      let current = this.tokens.shift();
      while (!(current instanceof FromToken)) {
        if (current instanceof EOFToken) {
          throw new Error('Query needs FROM clause.');
        }

        if (current instanceof IdentifierToken) {
          fields.push(current.literal);
        } else if (current instanceof AsteriskToken) {
          fields.push('*');
          this.tokens.shift();
          break;
        } else if (!(current instanceof CommaToken)) {
          throw new Error('Field list at SELECT clause is something wrong.');
        }
        current = this.tokens.shift();
      }
    }

    // TABLES
    const tables = [];
    let current = this.tokens.shift();
    {
      while (
        !(current instanceof WhereToken) &&
        !(current instanceof EOFToken) &&
        !(current instanceof OrderByToken)
      ) {
        if (current instanceof IdentifierToken) {
          tables.push((current as IdentifierToken).literal);
        } else if (!(current instanceof CommaToken)) {
          throw new Error('Field list at FROM clause is something wrong.');
        }
        current = this.tokens.shift();
      }
    }

    // WHERE
    let predicate = new Predicate([]);
    if (current === WhereToken.TOKEN) {
      // remove where
      predicate = this.parsePredicate();
      current = this.tokens.shift();
    }

    // ORDER BY
    const sortKeys = [];
    let isASC = true;
    if (current !== OrderByToken.TOKEN) {
      return new SelectData(fields, tables, predicate, [], true);
    }
    current = this.tokens.shift();
    while (current !== EOFToken.TOKEN) {
      if (current instanceof IdentifierToken) {
        sortKeys.push(current.literal);
        if (this.tokens[0] instanceof IdentifierToken) {
          // last token is sort order.
          break;
        }
      } else if (current !== CommaToken.TOKEN) {
        console.log('current:' + current);
        throw new Error('Field list at ORDER BY clause is something wrong.');
      }
      current = this.tokens.shift();
    }

    // ASC or DESC
    current = this.tokens[0];
    if (
      current instanceof IdentifierToken &&
      current.literal.toUpperCase() === 'DESC'
    ) {
      isASC = false;
    }
    return new SelectData(fields, tables, predicate, sortKeys, isASC);
  }

  private parsePredicate(): Predicate {
    // shunting-yard
    const result: Token[] = [];
    const stack: Token[] = [EOFToken.TOKEN];
    while (this.tokens.length > 0 && this.tokens[0] !== OrderByToken.TOKEN) {
      const current = this.tokens[0];
      if (
        getStackPriority(stack[stack.length - 1]) > getInputPriority(current)
      ) {
        const s = stack.pop();
        if (s !== RParenToken.TOKEN && s !== LParenToken.TOKEN) {
          result.push(s as Token);
        }
      } else if (this.tokens[0] !== OrderByToken.TOKEN) {
        stack.push(this.tokens.shift() as Token);
      }
    }
    while (stack.length > 0) {
      const s = stack.pop();
      if (s !== OrderByToken.TOKEN && s !== EOFToken.TOKEN) {
        result.push(s as Token);
      }
    }

    return new Predicate(result);
  }
}

export class SelectData {
  readonly fields: string[];
  readonly tables: string[];
  readonly where: Predicate;
  readonly sortKey: string[];
  readonly isAsc: boolean;

  constructor(
    fields: string[],
    tables: string[],
    where: Predicate,
    sortKey: string[],
    isAsc: boolean
  ) {
    this.fields = fields;
    this.tables = tables;
    this.where = where;
    this.sortKey = sortKey;
    this.isAsc = isAsc;
  }
}
