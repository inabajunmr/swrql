export abstract class Token {
  getStackPriority(): number {
    return 0;
  }
  getInputPriority(): number {
    return 0;
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
}

/**
 * FROM
 */
export class FromToken extends Token {
  static readonly TOKEN = new FromToken();

  toString(): string {
    return `FROM`;
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

/**
 * EOF
 */
export class EOFToken extends Token {
  static readonly TOKEN = new EOFToken();

  toString(): string {
    return `EOF`;
  }
}
