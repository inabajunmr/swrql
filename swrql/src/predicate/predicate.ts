import { Record } from '../scan/record';
import {
  AndToken,
  DiamondToken,
  EqualToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  IdentifierToken,
  LessThanOrEqualToken,
  LessThanToken,
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
      this.consumeComparativeOperator(current as Token, stack);
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

  private consumeComparativeOperator(operator: Token, stack: any[]) {
    if (
      operator === EqualToken.TOKEN ||
      operator === GreaterThanToken.TOKEN ||
      operator === GreaterThanOrEqualToken.TOKEN ||
      operator === LessThanToken.TOKEN ||
      operator === LessThanOrEqualToken.TOKEN ||
      operator === DiamondToken.TOKEN ||
      operator === AndToken.TOKEN ||
      operator === OrToken.TOKEN
    ) {
      const r = stack.pop();
      const l = stack.pop();
      switch (operator) {
        case EqualToken.TOKEN:
          stack.push(l === r);
          break;
        case GreaterThanToken.TOKEN:
          stack.push(l > r);
          break;
        case GreaterThanOrEqualToken.TOKEN:
          stack.push(l >= r);
          break;
        case LessThanToken.TOKEN:
          stack.push(l < r);
          break;
        case LessThanOrEqualToken.TOKEN:
          stack.push(l <= r);
          break;
        case DiamondToken.TOKEN:
          stack.push(l != r);
          break;
        case AndToken.TOKEN:
          stack.push(l && r);
          break;
        case OrToken.TOKEN:
          stack.push(l || r);
          break;
      }
    }
  }
}
