const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No data available.</div>
    );
  }

  return (
    <table className="w-full mt-4 border-collapse">
      <thead>
        <tr className="text-left text-gray-500 text-sm border-b">
          {columns.map((col) => (
            <th key={col.accessor} className={`p-2 ${col.className || ""}`}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
