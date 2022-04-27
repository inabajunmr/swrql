import { CSVScan } from './scan/csv/csvscan';
import { ProductScan } from './scan/productscan';
import { ProjectScan } from './scan/projectscan';
import { Scan } from './scan/scan';
import { Record } from './scan/record';
import { SelectScan } from './scan/selectscan';
import { SQLParser } from './sql/parser';

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

    if (targetTables.length === 0) {
      throw new Error(`${select.tables} is not found.`);
    }

    // Product
    let projected = targetTables.shift() as Scan;
    while (targetTables.length != 0) {
      projected = new ProductScan(projected, targetTables.shift() as Scan);
    }

    // Select
    const selectScan = new SelectScan(projected, select.where);

    // // Project
    const projectScan = new ProjectScan(selectScan, select.fields);

    // build result
    const result = [];
    while (projectScan.next()) {
      result.push(projectScan.getRecord());
    }

    return new SQLExecutionResult(result, projectScan.fields());
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
