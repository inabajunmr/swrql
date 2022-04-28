import { stringify } from 'csv-stringify/sync';
import * as swrql from 'swrql';

let tableCount = 0;
addTable();
(document.getElementById("csv1") as HTMLTextAreaElement).value = `a,b,c
1,2,3
x,y,z
one,two,three`;
(document.getElementById("sql") as HTMLTextAreaElement).value = `select * from abc where a=1;`;
(document.getElementById("tablename1") as HTMLTextAreaElement).value = `abc`;

export function execute(): void {
    document.getElementById("error")!.textContent = '';

    const sql = (document.getElementById("sql") as any).value;

    try {
        const scans: swrql.CSVScan[] = [];
        for (let i = 1; i <= tableCount; i++) {
            const csv = (document.getElementById("csv" + i) as any).value;
            const tableName = (document.getElementById("tablename" + i) as any).value;
            const scan = new swrql.CSVScan(tableName, csv);
            scans.push(scan);
        }
        const result = new swrql.SQLExecution(scans, sql).execute();
        if (result.records.length === 0) {
            document.getElementById("result")!.textContent = result.fields.join(',');
        } else {
            document.getElementById("result")!.textContent = stringify(result.records.map(r => r.unwrap()), { header: true });
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            document.getElementById("error")!.textContent = e.message;
        } else {
            document.getElementById("error")!.textContent = 'Unexpected error.';
        }
    }
}

document.getElementById("csv1")!.addEventListener("input", () => {
    execute();
})

document.getElementById("sql")!.addEventListener("input", () => {
    execute();
})

document.getElementById("tablename1")!.addEventListener("input", () => {
    execute();
})

document.getElementById('addtable')!.addEventListener('click', () => {
    addTable();
})

function addTable() {
    tableCount++;
    const div = document.createElement('div');
    const span = document.createElement('span');
    const tableName = document.createElement('input');
    tableName.id = 'tablename' + tableCount;
    tableName.type = 'text';
    tableName.value = 'table' + tableCount;
    tableName.addEventListener("input", () => {
        execute();
    });

    const deleteButton = document.createElement('input');
    deleteButton.onclick = () => {
        div.remove();
        tableCount--;
        execute();
    };
    deleteButton.value = 'remove';
    deleteButton.type = 'button';

    const csv = document.createElement('textarea');
    csv.id = 'csv' + tableCount;
    csv.style.height = '13em';
    csv.addEventListener("input", () => {
        execute();
    });

    span.appendChild(tableName);
    if (tableCount !== 1) {
        span.appendChild(deleteButton);
    }
    div.appendChild(span);
    div.appendChild(csv);
    document.getElementById('csv')?.appendChild(div);

}

execute();