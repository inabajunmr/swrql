export abstract class Token {
  getStackPriority(): number {
    return 0;
  }
  getInputPriority(): number {
    return 0;
  }
  isClauseDelimiter(): boolean {
    return false;
  }
}

/**
 * Identifier
 */
export class IdentifierToken extends Token {
  readonly literal: string;
  constructor(literal: string) {
    super();
    this.literal = literal;
  }

  toString(): string {
    return `Ident: ${this.literal}`;
  }

  asKeyword(): Token {
    switch (this.literal.toUpperCase()) {
      case 'SELECT':
        return SelectToken.TOKEN;
      case 'FROM':
        return FromToken.TOKEN;
      case 'WHERE':
        return WhereToken.TOKEN;
      case 'AND':
        return AndToken.TOKEN;
      case 'OR':
        return OrToken.TOKEN;
    }

    if (this.literal.match(/^[0-9]/)) {
      return new NumberToken(this.literal);
    }
    return this;
  }
}

/**
 * String
 */
export class StringToken extends Token {
  readonly literal: string;
  constructor(literal: string) {
    super();
    this.literal = literal;
  }

  toString(): string {
    return `String: ${this.literal}`;
  }
}

/**
 * Number
 */
export class NumberToken extends Token {
  readonly literal: string;
  constructor(literal: string) {
    super();
    this.literal = literal;
  }

  toString(): string {
    return `Number: ${this.literal}`;
  }
}

/**
 * SELECT
 */
export class SelectToken extends Token {
  static readonly TOKEN = new SelectToken();

  toString(): string {
    return `SELECT`;
  }

  isClauseDelimiter(): boolean {
    return true;
  }
}

/**
 * FROM
 */
export class FromToken extends Token {
  static readonly TOKEN = new FromToken();

  toString(): string {
    return `FROM`;
  }
  isClauseDelimiter(): boolean {
    return true;
  }
}

/**
 * WHERE
 */
export class WhereToken extends Token {
  static readonly TOKEN = new WhereToken();

  toString(): string {
    return `WHERE`;
  }
  isClauseDelimiter(): boolean {
    return true;
  }
}

/**
 * AND
 */
export class AndToken extends Token {
  static readonly TOKEN = new AndToken();

  toString(): string {
    return `AND`;
  }
}

/**
 * OR
 */
export class OrToken extends Token {
  static readonly TOKEN = new OrToken();

  toString(): string {
    return `OR`;
  }
}

/**
 * ORDER BY
 */
export class OrderByToken extends Token {
  static readonly TOKEN = new OrderByToken();
  toString(): string {
    return `ORDER BY`;
  }
  isClauseDelimiter(): boolean {
    return true;
  }
}

/**
 * GROUP BY
 */
export class GroupByToken extends Token {
  static readonly TOKEN = new GroupByToken();
  toString(): string {
    return `GROUP BY`;
  }
  isClauseDelimiter(): boolean {
    return true;
  }
}

/**
 * ,
 */
export class CommaToken extends Token {
  static readonly TOKEN = new CommaToken();

  toString(): string {
    return `Comma`;
  }
}

/**
 * *
 */
export class AsteriskToken extends Token {
  static readonly TOKEN = new AsteriskToken();

  toString(): string {
    return `*`;
  }
}

export class EqualToken extends Token {
  static readonly TOKEN = new EqualToken();

  toString(): string {
    return `=`;
  }
}

/**
 * (
 */
export class LParenToken extends Token {
  static readonly TOKEN = new LParenToken();

  toString(): string {
    return `(`;
  }
}

/**
 * )
 */
export class RParenToken extends Token {
  static readonly TOKEN = new RParenToken();

  toString(): string {
    return `)`;
  }
}

export class LessThanToken extends Token {
  static readonly TOKEN = new LessThanToken();

  toString(): string {
    return '<';
  }
}

export class LessThanOrEqualToken extends Token {
  static readonly TOKEN = new LessThanOrEqualToken();

  toString(): string {
    return '<=';
  }
}

export class GreaterThanToken extends Token {
  static readonly TOKEN = new GreaterThanToken();

  toString(): string {
    return '>';
  }
}

export class GreaterThanOrEqualToken extends Token {
  static readonly TOKEN = new GreaterThanOrEqualToken();

  toString(): string {
    return '>=';
  }
}

/**
 * <>
 */
export class DiamondToken extends Token {
  static readonly TOKEN = new DiamondToken();

  toString(): string {
    return '<>';
  }
}

/**
 * EOF
 */
export class EOFToken extends Token {
  static readonly TOKEN = new EOFToken();

  toString(): string {
    return `EOF`;
  }
  isClauseDelimiter(): boolean {
    return true;
  }
}
