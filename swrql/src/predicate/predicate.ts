import { Token } from '../sql/token';

export class Predicate {
  // RPN order tokens
  readonly tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
}
