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
  LessThanToken,
  LessThanOrEqualToken,
  GreaterThanToken,
  GreaterThanOrEqualToken,
  DiamondToken,
  OrderByToken,
  AndToken,
  NumberToken,
  GroupByToken,
  OrToken,
} from './token';

export class SQLLexer {
  private index = 0;
  private readonly sql: string;

  constructor(sql: string) {
    this.sql = sql;
  }

  tokens(): Token[] {
    let t = null;
    let r: Token[] = [];
    while (t instanceof EOFToken == false) {
      t = this.nextToken();
      const before = r[r.length - 1];
      if (
        t instanceof IdentifierToken &&
        t.literal.toUpperCase() == 'BY' &&
        before instanceof IdentifierToken &&
        (before.literal.toUpperCase() == 'ORDER' ||
          before.literal.toUpperCase() == 'GROUP')
      ) {
        if (before.literal.toUpperCase() == 'ORDER') {
          r[r.length - 1] = OrderByToken.TOKEN;
        } else {
          r[r.length - 1] = GroupByToken.TOKEN;
        }
      } else {
        r.push(t);
      }
    }

    // expand 'x in(a,b,c)' to '(x = a or x = b or x = c)'
    for (let i = 0; i < r.length; i++) {
      const c = r[i];
      if (c instanceof IdentifierToken && c.literal.toUpperCase() === 'IN') {
        const x = r[i - 1];
        if (r[i + 1] !== LParenToken.TOKEN) {
          continue;
        }
        const values = [];
        let j = i + 2; // skip in and `(`
        for (; j < r.length; j++) {
          const c = r[j];
          console.log(c);
          if (
            c instanceof IdentifierToken ||
            c instanceof StringToken ||
            c instanceof NumberToken
          ) {
            values.push(c);
          } else if (c === CommaToken.TOKEN) {
            continue;
          } else if (c === RParenToken.TOKEN) {
            break;
          } else {
            throw new Error('In clause is something wrong.');
          }
        }
        // expand
        const before = r.slice(0, i - 1);
        const after = r.slice(j + 1);
        const expandedIn = [];
        expandedIn.push(LParenToken.TOKEN);
        values.forEach((v) => {
          expandedIn.push(x);
          expandedIn.push(EqualToken.TOKEN);
          expandedIn.push(v);
          expandedIn.push(OrToken.TOKEN);
        });
        expandedIn.pop(); // remove redundant OR
        expandedIn.push(RParenToken.TOKEN);
        r = [...before, ...expandedIn, ...after];
        i = [...before, ...expandedIn].length;
      }
    }

    // expand 'x between a and b' to '(x >= a AND x <= b)';
    for (let i = 0; i < r.length; i++) {
      const c = r[i];
      if (
        c instanceof IdentifierToken &&
        c.literal.toUpperCase() === 'BETWEEN'
      ) {
        const x = r[i - 1];
        const a = r[i + 1];
        const and = r[i + 2];
        const b = r[i + 3];
        if (
          x instanceof IdentifierToken &&
          (a instanceof StringToken || a instanceof NumberToken) &&
          and === AndToken.TOKEN &&
          (b instanceof StringToken || b instanceof NumberToken)
        ) {
          const before = r.slice(0, i - 1);
          const after = r.slice(i + 4);
          // (x >= a AND x <=b)
          const expandedBetween = [
            LParenToken.TOKEN,
            x,
            GreaterThanOrEqualToken.TOKEN,
            a,
            AndToken.TOKEN,
            x,
            LessThanOrEqualToken.TOKEN,
            b,
            RParenToken.TOKEN,
          ];
          r = [...before, ...expandedBetween, ...after];
          i += 5;
        }
      }
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
      case '<':
        return this.readComparativeOperator();
      case '>':
        return this.readComparativeOperator();
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
    while (this.now().match(/[A-Za-z0-9_]+/) && !this.isEOF()) {
      result += this.now();
      this.nextChar();
    }
    return result;
  }

  private readComparativeOperator(): Token {
    let result = '';
    while (this.now().match(/[<>=]/) && !this.isEOF()) {
      result += this.now();
      this.nextChar();
    }

    switch (result) {
      case '<':
        return LessThanToken.TOKEN;
      case '<=':
        return LessThanOrEqualToken.TOKEN;
      case '>':
        return GreaterThanToken.TOKEN;
      case '>=':
        return GreaterThanOrEqualToken.TOKEN;
      case '<>':
        return DiamondToken.TOKEN;
    }
    throw Error(`${result} operator is not supported.`);
  }

  private readString(): string {
    let result = '';
    while (this.now() !== "'") {
      if (this.isEOF()) {
        throw Error('Unclosed double-quote.');
      }
      result += this.now();
      this.nextChar();
    }

    this.nextChar();
    return result;
  }
}
