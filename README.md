# swrql

🚧 It's just for my learning. NOT FOR PRODUCTION. 🚧

SQL Processor for CSV in TypeScript.

* [Library implementation & documentation](https://github.com/inabajunmr/swrql/tree/main/swrql)
* [Browser implementation](https://github.com/inabajunmr/swrql/tree/main/swrql)
* [npm](https://www.npmjs.com/package/swrql)

swrql is written in [HOSTEL Co-EDO SAWARA](https://www.hostel-sawara.jp/).

## Demo

https://inabajunmr.github.io/swrql/pages/public/

## Features

| Features                               |             |
| -------------------------------------- | ----------- |
| ORDER BY                               | ✅          |
| GROUP BY(count,sum,avg,max,min)        | ✅          |
| INNER JOIN                             | ✅          |
| OUTER JOIN                             | ✅          |
| BETWEEN                                | ✅          |
| IN                                     | ✅ except for subquery |
| NOT                                    | ✅          |
| ANY/ALL                                | Unsupported |
| Subquery                               | Unsupported |
| LIKE                                   | ✅ but can't use SQL wildcard. using only Regex. |
| LIMIT/OFFSET                           | Unsupported |
| UNION                                  | Unsupported |
| EXCEPT                                 | Unsupported |
| INTERSECT                              | Unsupported |
| DISTINCT                               | Unsupported |
| all of functions except for aggregation | Unsupported |
| INSERT                                 | Unsupported |
| UPDATE                                 | Unsupported |
| DELETE                                 | Unsupported |

## Example

```typescript
var swrql = require("swrql")
const table = new swrql.CSVScan('abc',
`a,b,c
1,2,3
x,y,z
foo,bar,baz`);
const sqlExecution = new swrql.SQLExecution([table], 'select * from abc;');
const actual = sqlExecution.execute();
actual.records.forEach((r) => console.log(r));
```

[try it on RunKit.](https://npm.runkit.com/swrql)
