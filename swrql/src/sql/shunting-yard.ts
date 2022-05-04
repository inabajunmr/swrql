import {
  AndToken,
  DiamondToken,
  EOFToken,
  EqualToken,
  GreaterThanOrEqualToken,
  GreaterThanToken,
  IdentifierToken,
  LessThanOrEqualToken,
  LessThanToken,
  LikeToken,
  LParenToken,
  NotToken,
  NumberToken,
  OrToken,
  RParenToken,
  StringToken,
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
    case NotToken.TOKEN:
      return 21;
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
    case LikeToken.TOKEN:
      return 22;
    default:
      if (
        t instanceof IdentifierToken ||
        t instanceof NumberToken ||
        t instanceof StringToken
      ) {
        return 30;
      } else {
        return 0;
      }
  }
}

export function getStackPriority(t: Token): number {
  switch (t) {
    case AndToken.TOKEN:
      return 21;
    case OrToken.TOKEN:
      return 10;
    case LParenToken.TOKEN:
      return 2;
    case NotToken.TOKEN:
      return 22;
    case EqualToken.TOKEN:
      return 23;
    case GreaterThanToken.TOKEN:
      return 23;
    case GreaterThanOrEqualToken.TOKEN:
      return 23;
    case LessThanToken.TOKEN:
      return 23;
    case LessThanOrEqualToken.TOKEN:
      return 23;
    case DiamondToken.TOKEN:
      return 23;
    case LikeToken.TOKEN:
      return 23;
    case EOFToken.TOKEN:
      return 0;
    default:
      return 30;
  }
}
