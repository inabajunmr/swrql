import { Record } from '../scan/record';
import {
  AndToken,
  EqualToken,
  IdentifierToken,
  NumberToken,
  OrToken,
  StringToken,
  Token,
} from '../sql/token';

/**
 * this predicate is implemented as PRN
 */
export class Predicate {
  // RPN order tokens
  readonly tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  test(record: Record): boolean {
    if (this.tokens.length === 0) {
      return true;
    }
    const tempTokens = [...this.tokens];
    const stack: any[] = [];
    while (tempTokens.length > 0) {
      const current = tempTokens.shift();
      if (current === EqualToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l === r) {
          stack.push(true);
        } else {
          stack.push(false);
        }
      } else if (current === AndToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l && r) {
          stack.push(true);
        } else {
          stack.push(false);
        }
      } else if (current === OrToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l || r) {
          stack.push(true);
        } else {
          stack.push(false);
        }
      }

      if (current instanceof IdentifierToken) {
        stack.push(record.get(current.literal));
      } else if (current instanceof StringToken) {
        stack.push(current.literal);
      } else if (current instanceof NumberToken) {
        stack.push(current.literal);
      }
    }

    return stack.pop();
  }
}
