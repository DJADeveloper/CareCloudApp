"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/facilityFlowData";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext"; // Import AppContext

type Resident = {
  id: string;
  residentNumber: string;
  fullName: string;
  photo?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  contactNumber: string;
  roomNumber: string;
  careLevel: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Resident Number",
    accessor: "residentNumber",
    className: "hidden md:table-cell",
  },
  {
    header: "Care Level",
    accessor: "careLevel",
    className: "hidden md:table-cell",
  },
  {
    header: "Room Number",
    accessor: "roomNumber",
    className: "hidden md:table-cell",
  },
  {
    header: "Contact",
    accessor: "contactNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ResidentListPage = () => {
  const { fetchResidents } = useAppContext(); // Fetch residents from AppContext
  const [residents, setResidents] = useState<Resident[]>([]); // State for resident data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch residents on component mount
  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoading(true);
        const data = await fetchResidents(); // Fetch the data
        console.log(data, "data");
        setResidents(data); // Assign the fetched data to state
      } catch (err) {
        console.error("Error fetching residents:", err);
        setError("Failed to fetch residents");
      } finally {
        setLoading(false);
      }
    };

    loadResidents(); // Call the async function
  }, [fetchResidents]);

  const renderRow = (item: Resident) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.photo ? (
          <Image
            src={item.photo}
            alt=""
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm text-gray-600">N/A</span>
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.fullName}</h3>
          <p className="text-xs text-gray-500">{item.gender}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.residentNumber}</td>
      <td className="hidden md:table-cell">{item.careLevel}</td>
      <td className="hidden md:table-cell">{item.roomNumber}</td>
      <td className="hidden md:table-cell">{item.contactNumber}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/resident/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="resident" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) return <p>Loading residents...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Residents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="resident" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={residents} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ResidentListPage;
