import { stringify } from 'csv-stringify/sync';
import * as swrql from 'swrql';

let tableCount = 0;
addTable();
(document.getElementById("tablename1") as HTMLTextAreaElement).value = `student`;
(document.getElementById("csv1") as HTMLTextAreaElement).value = 
`SId, SName, GradYear, MajorId
1, joe, 2021, 10
2, amy, 2020, 20
3, max, 2022, 10
4, sue, 2022, 20
5, bob, 2020, 30
6, kim, 2020, 20
7, art, 2021, 30
8, pat, 2019, 20
9, lee, 2021, 10
`;
addTable();
(document.getElementById("tablename2") as HTMLTextAreaElement).value = `dept`;
(document.getElementById("csv2") as HTMLTextAreaElement).value = 
`DId, DName
10, compsci
20, math
30, drama
`;
(document.getElementById("sql") as HTMLTextAreaElement).value = `select DName, count(*) from student,dept where MajorId=DId group by DName;`;

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