import * as swrql from 'swrql';

export function execute() : void {

    const tableName = (document.getElementById("tablename") as any).value;
    const csv = (document.getElementById("csv") as any).value;
    const sql = (document.getElementById("sql") as any).value;

    try {
        const scan = new swrql.CSVScan(tableName, csv);
        const records = new swrql.SQLExecution([scan], sql).execute();
        let result = 'a,b,c\n';
        records.forEach(r => {
            const a = r.get('a');
            const b = r.get('b');
            const c = r.get('c');
            result += `${a},${b},${c}` + '\n';
        });
    
        document.getElementById("result")!.textContent = result;    
    } catch(e) {
        console.log(`err ${e}`);
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