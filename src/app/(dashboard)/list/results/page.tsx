import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { careRecordsData, role } from "@/lib/facilityFlowData";
import Image from "next/image";

type CareRecord = {
  id: number;
  activity: string; // Description of the care activity
  resident: string; // Resident name
  staff: string; // Staff member responsible
  type: "incident" | "activity"; // Record type
  date: string; // Date of record
  notes?: string; // Additional notes about the record
};

const columns = [
  {
    header: "Activity/Incident",
    accessor: "activity",
  },
  {
    header: "Resident",
    accessor: "resident",
  },
  {
    header: "Staff",
    accessor: "staff",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CareRecordListPage = () => {
  const renderRow = (item: CareRecord) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.activity}</td>
      <td>{item.resident}</td>
      <td className="hidden md:table-cell">{item.staff}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "staff" ? (
            <>
              <FormModal table="careRecord" type="update" data={item} />
              <FormModal table="careRecord" type="delete" id={item.id} />
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Care Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "staff" ? (
              <FormModal table="careRecord" type="create" />
            ) : null}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={careRecordsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default CareRecordListPage;
