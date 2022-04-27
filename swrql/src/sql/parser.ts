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
    let current = this.tokens.shift();
    const fields: string[] = [];
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

    // TODO multiple tables
    const table = (this.tokens.shift() as IdentifierToken).literal;
    if (this.tokens[0] === WhereToken.TOKEN) {
      // remove where
      this.tokens.shift();
      return new SelectData(fields, [table], this.parsePredicate());
    } else {
      return new SelectData(fields, [table], new Predicate([]));
    }
  }

  private parsePredicate(): Predicate {
    // shunting-yard
    const result: Token[] = [];
    const stack: Token[] = [EOFToken.TOKEN];
    while (this.tokens.length > 0) {
      const current = this.tokens[0];
      if (
        getStackPriority(stack[stack.length - 1]) > getInputPriority(current)
      ) {
        const s = stack.pop();
        if (s !== RParenToken.TOKEN && s !== LParenToken.TOKEN) {
          result.push(s as Token);
        }
      } else {
        stack.push(this.tokens.shift() as Token);
      }
    }

    return new Predicate(result);
  }
}

export class SelectData {
  readonly fields: string[];
  readonly tables: string[];
  readonly where: Predicate;

  constructor(fields: string[], tables: string[], where: Predicate) {
    this.fields = fields;
    this.tables = tables;
    this.where = where;
  }
}
