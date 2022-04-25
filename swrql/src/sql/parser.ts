import { SQLLexer } from "./lexer";
import { FromToken, IdentifierToken, SelectToken, Token, WhereToken } from "./token";

export class SQLParser {
    private tokens: Token[];
    constructor(sql: string) {
        this.tokens = new SQLLexer(sql).tokens();
    }

    parse(): SelectData {
        if (!(this.tokens.shift() instanceof SelectToken)) {
            // TODO throw exception
        }
        let current = this.tokens.shift();
        const fields: string[] = [];
        while (!(current instanceof FromToken)) {
            if (current instanceof IdentifierToken) {
                fields.push(current.literal);
            }
            current = this.tokens.shift();
            // TODO throw exception when abnormal comma
            // TODO throw exception when no From
        }

        const tableToken = this.tokens.shift();
        if (!(tableToken instanceof IdentifierToken)) {
            // TODO throw exception
        }

        const table = (this.tokens.shift() as IdentifierToken).literal;
        return new SelectData(fields, table, parsePredicate())

    }

    private parsePredicate() {

    }
}



export class SelectData {
    readonly fields: string[];
    readonly table: string;
    readonly where: Predicate;

    constructor(fields: string[], table: string, where: Predicate) {
        this.fields = fields;
        this.table = table;
        this.where = where;
    }
}

export class Predicate {

}