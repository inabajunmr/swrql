import { CSVScan } from './csv/csvscan';
import { ProjectScan } from './projectscan';
test('procject', () => {
  const table = new CSVScan(
    'table',
    `t1a,t1b,t1c
        1,2,3
        a,b,c
        x,y,z`
  );
  const scan = new ProjectScan(table, ['t1a', 't1b']);
  expect(scan.next()).toBe(true);
  expect(scan.getRecord().size()).toBe(2);
  expect(scan.getRecord().get('t1a')).toBe('1');
  expect(scan.getRecord().get('t1b')).toBe('2');
  expect(scan.next()).toBe(true);
  expect(scan.getRecord().size()).toBe(2);
  expect(scan.getRecord().get('t1a')).toBe('a');
  expect(scan.getRecord().get('t1b')).toBe('b');
  expect(scan.next()).toBe(true);
  expect(scan.getRecord().size()).toBe(2);
  expect(scan.getRecord().get('t1a')).toBe('x');
  expect(scan.getRecord().get('t1b')).toBe('y');
  expect(scan.next()).toBe(false);
});
