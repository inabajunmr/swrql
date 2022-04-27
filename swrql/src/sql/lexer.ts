import {
  AsteriskToken,
  CommaToken,
  EOFToken,
  IdentifierToken,
  EqualToken,
  Token,
  StringToken,
  LParenToken,
  RParenToken,
} from './token';

export class SQLLexer {
  private index = 0;
  private readonly sql: string;

  constructor(sql: string) {
    this.sql = sql;
  }

  tokens(): Token[] {
    let t = null;
    const r: Token[] = [];
    while (t instanceof EOFToken == false) {
      t = this.nextToken();
      r.push(t);
    }
    return r;
  }

  private nextToken(): Token {
    this.skipWhitespace();
    if (this.isEOF()) {
      return EOFToken.TOKEN;
    }

    switch (this.now()) {
      case ';':
        this.nextChar();
        return EOFToken.TOKEN;
      case ',':
        this.nextChar();
        return CommaToken.TOKEN;
      case '=':
        this.nextChar();
        return EqualToken.TOKEN;
      case '*':
        this.nextChar();
        return AsteriskToken.TOKEN;
      case '(':
        this.nextChar();
        return LParenToken.TOKEN;
      case ')':
        this.nextChar();
        return RParenToken.TOKEN;
      case "'":
        this.nextChar();
        return new StringToken(this.readString());
      default: {
        return new IdentifierToken(this.readIdentifier()).asKeyword();
      }
    }
  }

  private now(): string {
    return this.sql.charAt(this.index);
  }

  private isEOF(): boolean {
    return this.index >= this.sql.length;
  }

  private skipWhitespace() {
    while (
      (this.now() === ' ' || this.now() === '\r' || this.now() === '\n') &&
      !this.isEOF()
    ) {
      this.nextChar();
    }
  }

  private nextChar() {
    ++this.index;
  }

  private readIdentifier(): string {
    let result = '';
    while (this.now().match(/[A-Za-z0-9_]/) && !this.isEOF()) {
      result += this.now();
      this.nextChar();
    }

    return result;
  }

  private readString(): string {
    let result = '';
    while (this.now() !== "'" && !this.isEOF()) {
      result += this.now();
      this.nextChar();
    }

    // TODO throw exception when unclosed string

    this.nextChar();
    return result;
  }
}
