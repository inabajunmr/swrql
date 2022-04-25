import {
  AndToken,
  EOFToken,
  EqualToken,
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
    case EOFToken.TOKEN:
      return 0;
    default:
      return 30;
  }
}
