import { CSVScan } from './scan/csv/csvscan';
import { ProductScan } from './scan/productscan';
import { ProjectScan } from './scan/projectscan';
import { Scan } from './scan/scan';
import { Record } from './scan/record';
import { SelectScan } from './scan/selectscan';
import { JoinTable, SelectFunction, SQLParser } from './sql/parser';
import { SortScan } from './scan/sortscan';
import { GroupScan } from './scan/groupscan';
import { Predicate } from './predicate/predicate';
import { OuterJoinScan } from './scan/outerjoinscan';

export class SQLExecution {
  private readonly tables: CSVScan[];
  private readonly sql: string;

  constructor(tables: CSVScan[], sql: string) {
    this.tables = tables;
    this.sql = sql;
  }

  execute(): SQLExecutionResult {
    const select = new SQLParser(this.sql).parse();
    const tableName = select.tables.shift();
    const table = this.tables.find((t) => t.tableName === tableName);
    if (table === undefined) {
      throw new Error(`${tableName} is not found.`);
    }
    let scan = table as Scan;

    // Product/Join
    select.tables.forEach((t) => {
      if (!(t instanceof JoinTable)) {
        throw Error('Unexpected error.');
      }
      if (t.joinType === 'product') {
        const target = this.tables.find((tt) => tt.tableName === t.tableName);
        if (target === undefined) {
          throw new Error(`${t.tableName} is not found.`);
        }
        scan = new ProductScan(scan, target as Scan);
      } else if (t.joinType === 'inner') {
        const target = this.tables.find((tt) => tt.tableName === t.tableName);
        if (target === undefined) {
          throw new Error(`${t.tableName} is not found.`);
        }
        // inner join is same as product and select
        scan = new SelectScan(
          new ProductScan(scan, target as Scan),
          t.predicate as Predicate
        );
      } else if (t.joinType === 'outer') {
        const target = this.tables.find((tt) => tt.tableName === t.tableName);
        if (target === undefined) {
          throw new Error(`${t.tableName} is not found.`);
        }
        if (t.leftOrRight === 'left') {
          scan = new OuterJoinScan(
            scan,
            target as Scan,
            t.predicate as Predicate
          );
        } else {
          scan = new OuterJoinScan(
            target as Scan,
            scan,
            t.predicate as Predicate
          );
        }
      } else {
        throw Error(`JoinType:${t.joinType} is not supported.`);
      }
    });

    // Select
    scan = new SelectScan(scan, select.where);

    // Aggregation
    if (select.groupByKeys.length !== 0) {
      scan = new GroupScan(
        scan,
        select.groupByKeys,
        select.fields.filter((f) => {
          return f instanceof SelectFunction;
        }) as SelectFunction[]
      );
    }

    // Project
    scan = new ProjectScan(scan, select.fields);

    // Sort
    if (select.sortKey.length !== 0) {
      scan = new SortScan(scan, select.sortKey, select.isAsc);
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
