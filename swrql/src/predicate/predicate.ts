import { Record } from '../scan/record';
import {
  AndToken,
  DiamondToken,
  EqualToken,
  LikeToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  IdentifierToken,
  LessThanOrEqualToken,
  LessThanToken,
  NumberToken,
  OrToken,
  StringToken,
  Token,
  NotToken,
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
      } else if (
        current instanceof StringToken ||
        current instanceof NumberToken
      ) {
        stack.push(current);
      }
    }
    return stack.pop();
  }

  private consumeComparativeOperator(operator: Token, stack: any[]) {
    if (operator === NotToken.TOKEN) {
      stack.push(!stack.pop());
      return;
    }
    if (
      operator === EqualToken.TOKEN ||
      operator === LikeToken.TOKEN ||
      operator === GreaterThanToken.TOKEN ||
      operator === GreaterThanOrEqualToken.TOKEN ||
      operator === LessThanToken.TOKEN ||
      operator === LessThanOrEqualToken.TOKEN ||
      operator === DiamondToken.TOKEN ||
      operator === AndToken.TOKEN ||
      operator === OrToken.TOKEN
    ) {
      const rToken = stack.pop();
      const lToken = stack.pop();
      let isNumber = false;
      if (rToken instanceof NumberToken || lToken instanceof NumberToken) {
        isNumber = true;
      }
      const r = this.translate(rToken, isNumber);
      const l = this.translate(lToken, isNumber);

      switch (operator) {
        case EqualToken.TOKEN:
          stack.push(l === r);
          break;
        case LikeToken.TOKEN:
          stack.push(new RegExp(r as string).test(l));
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

  private translate(pop: any, isNumber: boolean): any {
    if (pop instanceof StringToken) {
      return pop.literal;
    } else if (pop instanceof NumberToken) {
      return parseFloat(pop.literal);
    }

    if (isNumber) {
      return parseFloat(pop);
    }
    return pop;
  }
}
