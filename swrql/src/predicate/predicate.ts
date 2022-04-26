import { Record } from '../scan/scan';
import {
  AndToken,
  EqualToken,
  IdentifierToken,
  NumberToken,
  OrToken,
  StringToken,
  Token,
} from '../sql/token';

export class Predicate {
  // RPN order tokens
  readonly tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  test(record: Record): boolean {
    const tempTokens = [...this.tokens];
    const stack = [];
    while (tempTokens.length > 0) {
      const current = tempTokens.shift();

      if (current === EqualToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l === r) {
          stack.push('TRUE');
        } else {
          stack.push('FALSE');
        }
      } else if (current === AndToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l === 'TRUE' && r === 'TRUE') {
          stack.push('TRUE');
        } else {
          stack.push('FALSE');
        }
      } else if (current === OrToken.TOKEN) {
        const l = stack.pop();
        const r = stack.pop();
        if (l === 'TRUE' || r === 'TRUE') {
          stack.push('TRUE');
        } else {
          stack.push('FALSE');
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

    if (stack.pop() === 'TRUE') {
      return true;
    } else {
      return false;
    }
  }
}
