import {
  AndToken,
  DiamondToken,
  EOFToken,
  EqualToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  LessThanOrEqualToken,
  LessThanToken,
  LParenToken,
  OrToken,
  RParenToken,
  Token,
} from './token';

export function getInputPriority(t: Token): number {
  switch (t) {
    case AndToken.TOKEN:
      return 20;
    case OrToken.TOKEN:
      return 9;
    case LParenToken.TOKEN:
      return 29;
    case RParenToken.TOKEN:
      return 1;
    case EqualToken.TOKEN:
      return 21;
    case GreaterThanToken.TOKEN:
      return 21;
    case GreaterThanOrEqualToken.TOKEN:
      return 21;
    case LessThanToken.TOKEN:
      return 21;
    case LessThanOrEqualToken.TOKEN:
      return 21;
    case DiamondToken.TOKEN:
      return 21;
    case EOFToken.TOKEN:
      return 0;
    default:
      return 30;
  }
}

export function getStackPriority(t: Token): number {
  switch (t) {
    case AndToken.TOKEN:
      return 21;
    case OrToken.TOKEN:
      return 10;
    case LParenToken.TOKEN:
      return 1;
    case EqualToken.TOKEN:
      return 22;
    case GreaterThanToken.TOKEN:
      return 22;
    case GreaterThanOrEqualToken.TOKEN:
      return 22;
    case LessThanToken.TOKEN:
      return 22;
    case LessThanOrEqualToken.TOKEN:
      return 22;
    case DiamondToken.TOKEN:
      return 22;
    case EOFToken.TOKEN:
      return 0;
    default:
      return 30;
  }
}
