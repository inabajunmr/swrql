import { Predicate } from '../predicate/predicate';
import { SQLLexer } from './lexer';
import { getInputPriority, getStackPriority } from './shunting-yard';
import {
  AsteriskToken,
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
    if (!(this.tokens.shift() instanceof SelectToken)) {
      // TODO throw exception
    }
    let current = this.tokens.shift()?.get();
    const fields: string[] = [];
    while (!(current instanceof FromToken)) {
      if (current instanceof IdentifierToken) {
        fields.push(current.literal);
      } else if (current instanceof AsteriskToken) {
        fields.push('*');
        this.tokens.shift();
        break;
      }
      current = this.tokens.shift()?.get();

      // TODO throw exception when abnormal comma
      // TODO throw exception when no From
    }

    const table = (this.tokens.shift() as IdentifierToken).literal;
    if (this.tokens[0].get() === WhereToken.TOKEN) {
      // remove where
      this.tokens.shift();
      return new SelectData(fields, table, this.parsePredicate());
    } else {
      return new SelectData(fields, table, new Predicate([]));
    }
  }

  private parsePredicate(): Predicate {
    // shunting-yard
    const result: Token[] = [];
    const stack: Token[] = [EOFToken.TOKEN];
    while (this.tokens.length > 0) {
      const current = this.tokens[0].get();
      if (
        getStackPriority(stack[stack.length - 1]) > getInputPriority(current)
      ) {
        const s = stack.pop()?.get();
        if (s !== RParenToken.TOKEN && s !== LParenToken.TOKEN) {
          result.push(s as Token);
        }
      } else {
        stack.push(this.tokens.shift()?.get() as Token);
      }
    }

    return new Predicate(result);
  }
}

export class SelectData {
  readonly fields: string[];
  readonly table: string;
  readonly where: Predicate;

  constructor(fields: string[], table: string, where: Predicate) {
    this.fields = fields;
    this.table = table;
    this.where = where;
  }
}
