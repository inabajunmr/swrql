import { stringify } from 'csv-stringify/sync';
import * as swrql from 'swrql';

export function execute() : void {
    document.getElementById("error")!.textContent = '';

    const tableName = (document.getElementById("tablename") as any).value;
    const csv = (document.getElementById("csv") as any).value;
    const sql = (document.getElementById("sql") as any).value;

    try {
        const scan = new swrql.CSVScan(tableName, csv);
        const result = new swrql.SQLExecution([scan], sql).execute();
        if(result.records.length === 0) {
            document.getElementById("result")!.textContent = result.fields.join(',');
        }else {
            document.getElementById("result")!.textContent = stringify(result.records.map(r => r.unwrap()), { header: true });
        }        
    } catch(e:unknown) {
        if(e instanceof Error) {
            document.getElementById("error")!.textContent = e.message;
        } else {
            document.getElementById("error")!.textContent = 'Unexpected error.';
        }
    }
}
(document.getElementById("csv")as HTMLTextAreaElement).value = `a,b,c
1,2,3
x,y,z
one,two,three`;

(document.getElementById("sql")as HTMLTextAreaElement).value = `select * from abc where a=1;`;
(document.getElementById("tablename")as HTMLTextAreaElement).value = `abc`;


document.getElementById("csv")!.addEventListener("input", () => {
    execute();
})

document.getElementById("sql")!.addEventListener("input", () => {
    execute();
})

document.getElementById("tablename")!.addEventListener("input", () => {
    execute();
})

execute();