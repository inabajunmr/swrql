import { CSVScan } from './scan/csv/csvscan';
import { ProductScan } from './scan/productscan';
import { ProjectScan } from './scan/projectscan';
import { Scan } from './scan/scan';
import { Record } from './scan/record';
import { SelectScan } from './scan/selectscan';
import { SQLParser } from './sql/parser';
import { SortScan } from './scan/sortscan';

export class SQLExecution {
  private readonly tables: CSVScan[];
  private readonly sql: string;

  constructor(tables: CSVScan[], sql: string) {
    this.tables = tables;
    this.sql = sql;
  }

  execute(): SQLExecutionResult {
    const select = new SQLParser(this.sql).parse();

    const targetTables = this.tables.filter((s) => {
      return select.tables.includes(s.tableName);
    });

    select.tables.forEach((t) => {
      if (!this.tables.map((v) => v.tableName).includes(t)) {
        throw new Error(`${t} is not found.`);
      }
    });

    // Product
    let projected = targetTables.shift() as Scan;
    while (targetTables.length != 0) {
      projected = new ProductScan(projected, targetTables.shift() as Scan);
    }

    // Select
    const selectScan = new SelectScan(projected, select.where);

    // // Project
    const projectScan = new ProjectScan(selectScan, select.fields);

    // Sort
    let scan: Scan = projectScan;
    if (select.sortKey.length !== 0) {
      scan = new SortScan(projectScan, select.sortKey, select.isAsc);
    }

    // build result
    const result = [];
    while (scan.next()) {
      result.push(scan.getRecord());
    }

    return new SQLExecutionResult(result, scan.fields());
  }
}

export class SQLExecutionResult {
  readonly records: Record[];
  readonly fields: string[];
  constructor(records: Record[], fields: string[]) {
    this.records = records;
    this.fields = fields;
  }
}
