import { Predicate } from '../predicate/predicate';
import { SQLLexer } from './lexer';
import { getInputPriority, getStackPriority } from './shunting-yard';
import {
  AsteriskToken,
  CommaToken,
  EOFToken,
  FromToken,
  GroupByToken,
  IdentifierToken,
  JoinToken,
  LParenToken,
  OnToken,
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
    const fields: SelectTarget[] = [];
    {
      let current = this.tokens.shift();
      while (!(current instanceof FromToken)) {
        if (current instanceof EOFToken) {
          throw new Error('Query needs FROM clause.');
        }

        if (current instanceof IdentifierToken) {
          fields.push(new SelectField(current.literal));
        } else if (current instanceof LParenToken) {
          const functionType = fields.pop();
          if (!(functionType instanceof SelectField)) {
            throw Error(`Unexpected error. ${functionType}`);
          }
          const argToken = this.tokens.shift();
          let arg: string;
          if (argToken instanceof IdentifierToken) {
            arg = argToken.literal;
          } else if (argToken instanceof AsteriskToken) {
            arg = '*';
          } else {
            throw Error(`Argument of ${functionType} is something wrong.`);
          }
          if (this.tokens.shift() !== RParenToken.TOKEN) {
            throw Error('function in SELECT-CLAUSE is something wrong.');
          }
          fields.push(
            new SelectFunction(
              functionType.fieldName as selectFunctionType,
              arg
            )
          );
        } else if (current instanceof AsteriskToken) {
          fields.push(new SelectField('*'));
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
      while (!current?.isClauseDelimiter()) {
        // 'INNER JOIN' and just 'JOIN' are same so skip 'INNER'
        if (
          current instanceof IdentifierToken &&
          (current.literal.toUpperCase() === 'LEFT' ||
            current.literal.toUpperCase() === 'RIGHT')
        ) {
          const leftOrRight = current.literal.toUpperCase();
          let outerOrJoin = this.tokens.shift();
          if (
            outerOrJoin instanceof IdentifierToken &&
            outerOrJoin.literal.toUpperCase() === 'OUTER'
          ) {
            const join = this.tokens.shift();
            if (join !== JoinToken.TOKEN) {
              throw Error('JOIN is something wrong.');
            }
            outerOrJoin = join;
          }
          const joinTable = this.tokens.shift();
          const on = this.tokens.shift();
          if (!(on instanceof OnToken)) {
            throw new Error(`No JOIN condition.`);
          }
          const pre = this.parsePredicate();
          if (joinTable instanceof IdentifierToken) {
            if (leftOrRight === 'LEFT') {
              tables.push(
                new JoinTable('outer', joinTable.literal, 'left', pre)
              );
            } else {
              tables.push(
                new JoinTable('outer', joinTable.literal, 'right', pre)
              );
            }
          } else {
            throw new Error(`JOIN needs target table.`);
          }
        } else if (
          current instanceof IdentifierToken &&
          current.literal.toUpperCase() !== 'INNER'
        ) {
          tables.push((current as IdentifierToken).literal);
        } else if (current instanceof JoinToken) {
          const joinTable = this.tokens.shift();
          const on = this.tokens.shift();
          if (!(on instanceof OnToken)) {
            throw new Error(`No JOIN condition.`);
          }
          const pre = this.parsePredicate();
          if (joinTable instanceof IdentifierToken) {
            tables.push(
              new JoinTable('inner', joinTable.literal, undefined, pre)
            );
          } else {
            throw new Error(`JOIN needs target table.`);
          }
        } else if (current instanceof CommaToken) {
          const joinTable = this.tokens.shift();
          if (joinTable instanceof IdentifierToken) {
            tables.push(
              new JoinTable('product', joinTable.literal, undefined, undefined)
            );
          }
        } else if (
          current instanceof IdentifierToken &&
          current.literal.toUpperCase() === 'INNER'
        ) {
          // NOP
        } else {
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

    // GROUP BY
    const groupByKeys = [];
    if (current === GroupByToken.TOKEN) {
      current = this.tokens.shift();
      while (!current?.isClauseDelimiter()) {
        if (current instanceof IdentifierToken) {
          groupByKeys.push(current.literal);
        } else if (current !== CommaToken.TOKEN) {
          throw new Error('Field list at GROUP BY clause is something wrong.');
        }
        current = this.tokens.shift();
      }
    }

    // ORDER BY
    const sortKeys = [];
    let isASC = true;
    if (current !== OrderByToken.TOKEN) {
      return new SelectData(fields, tables, predicate, groupByKeys, [], true);
    }
    current = this.tokens.shift();
    while (!current?.isClauseDelimiter()) {
      if (current instanceof IdentifierToken) {
        sortKeys.push(current.literal);
        if (this.tokens[0] instanceof IdentifierToken) {
          // last token is sort order.
          break;
        }
      } else if (current !== CommaToken.TOKEN) {
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
    return new SelectData(
      fields,
      tables,
      predicate,
      groupByKeys,
      sortKeys,
      isASC
    );
  }

  private parsePredicate(): Predicate {
    // shunting-yard
    const result: Token[] = [];
    const stack: Token[] = [EOFToken.TOKEN];
    while (this.tokens.length > 0 && !this.tokens[0].isClauseDelimiter()) {
      const current = this.tokens[0];
      if (
        getStackPriority(stack[stack.length - 1]) > getInputPriority(current)
      ) {
        const s = stack.pop();
        if (s !== RParenToken.TOKEN && s !== LParenToken.TOKEN) {
          result.push(s as Token);
        }
      } else if (!this.tokens[0].isClauseDelimiter()) {
        stack.push(this.tokens.shift() as Token);
      }
    }
    while (stack.length > 0) {
      const s = stack.pop();
      if (
        !s?.isClauseDelimiter() &&
        s !== RParenToken.TOKEN &&
        s !== LParenToken.TOKEN
      ) {
        result.push(s as Token);
      }
    }

    return new Predicate(result);
  }
}

export class SelectData {
  readonly fields: SelectTarget[];
  readonly tables: (string | JoinTable)[];
  readonly where: Predicate;
  readonly groupByKeys: string[];
  readonly sortKey: string[];
  readonly isAsc: boolean;

  constructor(
    fields: SelectTarget[],
    tables: (string | JoinTable)[],
    where: Predicate,
    groupByKeys: string[],
    sortKey: string[],
    isAsc: boolean
  ) {
    this.fields = fields;
    this.tables = tables;
    this.where = where;
    this.groupByKeys = groupByKeys;
    this.sortKey = sortKey;
    this.isAsc = isAsc;
  }
}

export interface SelectTarget {
  toFieldName(): string;
}

export class SelectField implements SelectTarget {
  readonly fieldName: string;
  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }
  toFieldName(): string {
    return this.fieldName;
  }
}

export type selectFunctionType = 'count' | 'sum' | 'avg' | 'max' | 'min';
export class SelectFunction implements SelectTarget {
  readonly functionType: selectFunctionType;
  readonly arg: string;

  constructor(functionType: selectFunctionType, arg: string) {
    this.functionType = functionType;
    this.arg = arg;
  }
  toFieldName(): string {
    return `${this.functionType}(${this.arg})`;
  }
}

export type joinType = 'product' | 'inner' | 'outer';
export type leftOrRight = 'left' | 'right';
export class JoinTable {
  readonly joinType: joinType;
  readonly tableName: string;
  readonly predicate: Predicate | undefined;
  readonly leftOrRight: leftOrRight | undefined;

  constructor(
    joinType: joinType,
    tableName: string,
    leftOrRight: leftOrRight | undefined,
    predicate: Predicate | undefined
  ) {
    this.joinType = joinType;
    this.tableName = tableName;
    this.leftOrRight = leftOrRight;
    this.predicate = predicate;
  }
}
