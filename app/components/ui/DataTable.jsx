import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";

const DataTable = ({ headers, rows, renderRow, title, emptyMessage }) => {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-lg">
      {title && (
        <div className="p-6 border-b bg-white">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      <div className="p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {headers.map((header) => (
                <TableHead key={header} className="font-semibold text-gray-700">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{rows.map((row, index) => renderRow(row, index))}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
