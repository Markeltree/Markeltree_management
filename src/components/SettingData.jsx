import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import SearchBox from "@/components/SearchBox";
import CustomPaginator from "@/components/CustomPaginator";
import { useModal } from "@/context/ModalContext";
import WorkflowConfigureModal from "../modals/WorkflowConfigureModal";
import AddNewRoleModal from "../modals/AddNewRoleModal";
import ViewPermissionsModal from "../modals/ViewPermissionsModal";
import EditRoleAndPermissionsModal from "../modals/EditRoleAndPermissionsModal";
import ActionButton from "./ActionButton";

// ✅ Tab titles
export const tabTitles = [
  {
    heading: "User Roles & Permission",
    subheading: "Manage role-based access to different system functionalities.",
  },
  {
    heading: "Workflow Configuration",
    subheading: "Modify or create a custom workflow rule.",
  },
];

// Dummy dataset
export const userRolesPermissionsData = [
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example2@gmail.com", role: "Admin", status: "Active" },
  { email: "manager2@gmail.com", role: "Manager", status: "Active" },
  { email: "employee2@gmail.com", role: "Employee", status: "Active" },
  { email: "joey2@gmail.com", role: "Accountant", status: "Pending" },
  { email: "example@gmail.com", role: "Admin", status: "Active" },
  { email: "manager@gmail.com", role: "Manager", status: "Active" },
  { email: "employee@gmail.com", role: "Employee", status: "Active" },
  { email: "joey@gmail.com", role: "Accountant", status: "Pending" },
];

// ✅ Main Component
export function UserRolesPermissions() {
  const { openModal, closeModal } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 11; // ✅ show 11 records per page

  const filterRef = useRef(null);
  const filterPanelRef = useRef(null);
  const AddNewRole = () => {
    openModal(AddNewRoleModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  // ✅ Status column template
  const statusTemplate = (rowData) => (
    <span
      className={`min-w-[110px] h-[32px] inline-flex items-center justify-center rounded-md text-[13px] font-semibold ${
        rowData.status === "Active"
          ? "bg-[#22C55E26] text-[#22C55E]"
          : "bg-[#DDD42726] text-[#DDD427]"
      }`}
    >
      {rowData.status}
    </span>
  );
  const ViewPermissions = () => {
    openModal(ViewPermissionsModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };
  const EditRoleAndPermissions = () => {
    openModal(EditRoleAndPermissionsModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  // ✅ Permissions column template
  const permissionsTemplate = () => (
    <div className="w-8 h-7 flex items-center justify-center rounded-md border border-[#33333380] dark:border-[#2C2C2C] bg-white dark:bg-[#1A1A1A] cursor-pointer">
      <Icon
        onClick={ViewPermissions}
        icon="mdi:eye-outline"
        className="text-gray-600 dark:text-gray-300"
        width={16}
        height={16}
      />
    </div>
  );

  // ✅ Actions column template
  const actionTemplate = () => (
    <div className="flex items-center gap-3">
      <Icon
        onClick={EditRoleAndPermissions}
        icon="tabler:edit"
        style={{ color: "#0088D1" }}
        className="cursor-pointer"
        width={20}
        height={20}
      />
      <Icon
        icon="tabler:trash"
        style={{ color: "#EF4444" }}
        className="cursor-pointer"
        width={20}
        height={20}
      />
    </div>
  );

  // ✅ Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  // ✅ Apply filtering
  const filteredData = userRolesPermissionsData.filter((user) => {
    return (
      (!filters.role || user.role === filters.role) &&
      (!filters.status || user.status === filters.status) &&
      (!globalFilter ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.role.toLowerCase().includes(globalFilter.toLowerCase()))
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pagedRows = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // ✅ Columns definition
  const columns = [
    { field: "email", header: "Emails" },
    { field: "role", header: "Role" },
    { field: "status", header: "Status", body: statusTemplate },
    { field: "permissions", header: "Permissions", body: permissionsTemplate },
    { field: "actions", header: "Actions", body: actionTemplate },
  ];

  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-[#1C1C1C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#2B2B2B] dark:text-[#D4D4D4]">
            {tabTitles[0].heading}
          </h2>
          <p className="text-sm text-[#8E8E9C]">{tabTitles[0].subheading}</p>
        </div>

        {/* Search + Buttons */}
        <div className="flex flex-col md:flex-row gap-3 relative">
          <SearchBox
            styling="w-[250px] h-9 pl-10 pr-4 rounded-lg text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
            placeholder="Search user, permissions..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            {/* Filters */}
            <div ref={filterRef}>
              <ActionButton
                label="Filter"
                icon="cuida:filter-outline"
                buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                iconPos="left"
                onClick={() => {
                  if (!filterOpen) {
                    setTempFilters(filters || {});
                  }
                  setFilterOpen((v) => !v);
                }}
              />

              {/* Dropdown panel */}
              {filterOpen && filterRef.current && (
                <div
                  ref={filterPanelRef}
                  className="absolute mt-2 w-72 bg-white dark:bg-[#0D0D0D] rounded-lg shadow-lg p-4 z-50"
                  style={{
                    top: filterRef.current.offsetHeight + 4,
                    left:
                      window.innerWidth >= 1024
                        ? filterRef.current.offsetLeft - 150
                        : filterRef.current.offsetLeft,
                    minWidth: "16rem",
                  }}
                >
                  <h3 className="text-sm font-medium mb-3 text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Filter Users
                  </h3>

                  {/* Role Filter */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Role
                    </label>
                    <select
                      value={tempFilters.role || ""}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, role: e.target.value })
                      }
                      className="w-full mt-1 p-2 rounded-lg text-sm border dark:border-gray-600 dark:bg-[#0D0D0D] dark:text-white"
                    >
                      <option value="">All</option>
                      {[
                        ...new Set(userRolesPermissionsData.map((u) => u.role)),
                      ].map((role, idx) => (
                        <option key={idx} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <select
                      value={tempFilters.status || ""}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          status: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 rounded-lg text-sm border dark:border-gray-600 dark:bg-[#0D0D0D] dark:text-white"
                    >
                      <option value="">All</option>
                      {[
                        ...new Set(
                          userRolesPermissionsData.map((u) => u.status)
                        ),
                      ].map((status, idx) => (
                        <option key={idx} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row justify-between gap-2 mt-4">
                    <ActionButton
                      label="Reset"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#EA7D00] dark:bg-[#0D0D0D] dark:text-[#EA7D00] border border-[#EA7D00] focus:outline-none focus:ring-0"
                      onClick={() => {
                        setTempFilters({});
                        setFilters({});
                      }}
                    />

                    <ActionButton
                      label="Apply Filter"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#EA7D00] text-white dark:bg-[#EA7D00] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={() => {
                        setFilters(tempFilters);
                        setFilterOpen(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Add new role */}
            <button
              onClick={AddNewRole}
              className="flex items-center gap-2 px-4 py-2 bg-[#0088D1] text-white rounded-lg text-sm transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)] whitespace-nowrap"
            >
              <Icon icon="mdi:plus-circle" width={18} />
              Add new role
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pt-1 overflow-x-auto w-full">
        <DataTable
          value={pagedRows}
          paginator={false}
          className="p-datatable-sm w-full my-delete-table [&_.p-datatable-tbody>tr]:dark:!bg-black "
          rowClassName={() =>
            "border-b border-[#6E7A8626] text-[13px] text-[#666666] dark:text-[#EEF8FD] dark:bg-black whitespace-nowrap"
          }
          emptyMessage={
            <div className=" py-6 text-[15px] bg-white dark:bg-black text-black dark:text-white">
              No users found.
            </div>
          }
        >
          {columns.map((col, idx) => (
            <Column
              key={idx}
              field={col.field}
              header={col.header}
              body={(rowData) =>
                col.body ? col.body(rowData) : rowData[col.field]
              }
              headerClassName="text-[12px] text-[#33333380] dark:text-[#8E8E9C] dark:bg-black font-semibold bg-white whitespace-nowrap"
              style={
                idx === 0
                  ? { width: "50%" }
                  : { width: `${50 / (columns.length - 1)}%` }
              }
            />
          ))}
        </DataTable>
      </div>

      <CustomPaginator
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        maxButtons={5}
      />
    </div>
  );
}

// ✅ Workflow Configuration Component
export function WorkflowConfiguration() {
  const { openModal, closeModal } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 11;
  const AddNewWorkFlow = () => {
    openModal(WorkflowConfigureModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const filterRef = useRef(null);
  const filterPanelRef = useRef(null);


  // ✅ Dummy dataset
  const workflowData = [
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Order Processing",
      description: "Require Manager Approval for Orders Over [$500 ⬇️] ",
    },
    {
      name: "Leave Approval",
      description: "Workflow for managing employee leave requests.",
    },
    {
      name: "Expense Reimbursement",
      description: "Workflow for handling employee expense claims.",
    },
    {
      name: "New Hire Onboarding",
      description: "Workflow to guide onboarding of new employees.",
    },
    {
      name: "Project Approval",
      description: "Workflow for project proposals and approvals.",
    },
    {
      name: "Vendor Registration",
      description: "Workflow to approve and register new vendors.",
    },
    {
      name: "Purchase Order",
      description: "Workflow for raising and approving purchase orders.",
    },
    {
      name: "Approval",
      description: "Workflow to validate and approve timesheets.",
    },
    {
      name: "IT",
      description: "Workflow for requesting access to IT systems.",
    },
    {
      name: "Leave",
      description: "Workflow for managing employee leave requests.",
    },
    {
      name: "Expense Reimbursement",
      description: "Workflow for handling employee expense claims.",
    },
    {
      name: "New Hire Onboarding",
      description: "Workflow to guide onboarding of new employees.",
    },
    {
      name: "Project Approval",
      description: "Workflow for project proposals and approvals.",
    },
    {
      name: "Vendor",
      description: "Workflow to approve and register new vendors.",
    },
    {
      name: "Order",
      description: "Workflow for raising and approving purchase orders.",
    },
    {
      name: "Timesheet Approval",
      description: "Workflow to validate and approve timesheets.",
    },
    {
      name: "IT Access Request",
      description: "Workflow for requesting access to IT systems.",
    },
    {
      name: "Purchase Order",
      description: "Workflow for raising and approving purchase orders.",
    },
    {
      name: "Approval",
      description: "Workflow to validate and approve timesheets.",
    },
    {
      name: "IT",
      description: "Workflow for requesting access to IT systems.",
    },
    {
      name: "Leave",
      description: "Workflow for managing employee leave requests.",
    },
    {
      name: "Expense Reimbursement",
      description: "Workflow for handling employee expense claims.",
    },
    {
      name: "New Hire Onboarding",
      description: "Workflow to guide onboarding of new employees.",
    },
    {
      name: "Project Approval",
      description: "Workflow for project proposals and approvals.",
    },
    {
      name: "Vendor",
      description: "Workflow to approve and register new vendors.",
    },
    {
      name: "Order",
      description: "Workflow for raising and approving purchase orders.",
    },
    {
      name: "Timesheet Approval",
      description: "Workflow to validate and approve timesheets.",
    },
    {
      name: "IT Access Request",
      description: "Workflow for requesting access to IT systems.",
    },
  ];

  // ✅ Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  // ✅ Apply filtering
  const filteredData = workflowData.filter((item) => {
    return (
      (!filters.workflow || item.name === filters.workflow) &&
      (!globalFilter ||
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.description.toLowerCase().includes(globalFilter.toLowerCase()))
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pagedRows = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // ✅ Actions column template
  const actionTemplate = () => (
    <div className="flex items-center gap-2">
      {/* Edit Button - outlined */}
      <button
        type="button"
        className="flex items-center gap-2 bg-white dark:bg-black 
                   text-[#0088D1] dark:text-[#01CEE9] 
                   border border-[#0088D1] dark:border-[#01CEE9] 
                   px-3 py-1 rounded text-[11px] font-medium"
      >
        <Icon icon="tabler:edit" width={14} height={14} />
        Edit
      </button>

      {/* Delete Button - filled */}
      <button
        type="button"
        className="flex items-center gap-2 
                   bg-[#EF4444] hover:bg-[#dc2626] 
                   text-white 
                   border border-[#EF4444] 
                   px-3 py-1 rounded text-[11px] font-medium"
      >
        <Icon icon="tabler:trash" width={14} height={14} />
        Delete
      </button>
    </div>
  );

  // ✅ Columns definition
  const columns = [
    { field: "name", header: "Workflow Name" },
    { field: "description", header: "Workflow Description" },
    { field: "actions", header: "Actions", body: actionTemplate },
  ];

  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-[#1C1C1C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#2B2B2B] dark:text-[#D4D4D4]">
            {tabTitles[1].heading}
          </h2>
          <p className="text-sm text-[#8E8E9C]">{tabTitles[1].subheading}</p>
        </div>

        {/* Search + Filters + Add New Workflow */}
        <div className="flex flex-col md:flex-row gap-3 relative">
          {/* Search */}
          <SearchBox
            styling="w-[250px] h-9 pl-10 pr-4 rounded-lg text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
            placeholder="Search workflow..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <div className="flex flex-row gap-2 w-full">
            {/* Filters */}
            <div ref={filterRef}>
              <ActionButton
                label="Filter"
                icon="cuida:filter-outline"
                buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                iconPos="left"
                onClick={() => {
                  if (!filterOpen) setTempFilters(filters);
                  setFilterOpen(!filterOpen);
                }}
              />

              {/* Dropdown panel */}
              {filterOpen && filterRef.current && (
                <div
                  ref={filterPanelRef} // ⬅ here
                  className="absolute bg-white dark:bg-[#0D0D0D] shadow-lg rounded-lg p-4 z-50"
                  style={{
                    top: filterRef.current.offsetHeight + 4,
                    left:
                      window.innerWidth >= 1024
                        ? filterRef.current.offsetLeft - 150
                        : filterRef.current.offsetLeft,
                    maxWidth: "16rem",
                    minWidth: "16rem",
                  }}
                >
                  <h3 className="text-sm font-medium mb-3 text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Filter Workflows
                  </h3>

                  {/* Workflow Name Dropdown */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Workflow Name
                    </label>
                    <select
                      value={tempFilters.workflow || ""}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          workflow: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-2 rounded-lg text-sm border dark:border-gray-600 dark:bg-[#0D0D0D] dark:text-white"
                    >
                      <option value="">All</option>
                      {[...new Set(workflowData.map((wf) => wf.name))].map(
                        (name, idx) => (
                          <option key={idx} value={name}>
                            {name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row justify-between gap-2 mt-4">
                    <ActionButton
                      label="Reset"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#EA7D00] dark:bg-[#0D0D0D] dark:text-[#EA7D00] border border-[#EA7D00] focus:outline-none focus:ring-0"
                      onClick={() => {
                        setTempFilters({});
                        setFilters({});
                      }}
                    />

                    <ActionButton
                      label="Apply Filter"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#EA7D00] text-white dark:bg-[#EA7D00] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={() => {
                        setFilters(tempFilters);
                        setFilterOpen(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Add new workflow */}
            <button
              onClick={AddNewWorkFlow}
              className="flex items-center w-auto h-[40px] gap-2 px-4 py-2 bg-[#0088D1] text-white rounded-lg text-sm hover:bg-[#4c4fdd] transition-all whitespace-nowrap"
            >
              <Icon icon="mdi:plus-circle" width={18} />
              Add new workflow
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pt-6 overflow-x-auto w-full">
        <DataTable
          value={pagedRows}
          paginator={false}
          className="p-datatable-sm w-full my-delete-table [&_.p-datatable-tbody>tr]:dark:!bg-black"
          rowClassName={() =>
            "border-b border-[#6E7A8626] text-[13px] text-[#666666] dark:text-[#EEF8FD] dark:bg-black whitespace-nowrap"
          }
          emptyMessage={
            <div className=" py-6 text-[15px] bg-white dark:bg-black text-black dark:text-white">
              No workflow options.
            </div>
          }
        >
          {columns.map((col, idx) => (
            <Column
              key={idx}
              field={col.field}
              header={col.header}
              body={(rowData) =>
                col.body ? col.body(rowData) : rowData[col.field]
              }
              headerClassName="text-[12px] text-[#33333380] dark:text-[#8E8E9C] dark:bg-black font-semibold bg-white whitespace-nowrap"
              style={
                idx === 0
                  ? { width: "30%" }
                  : idx === 1
                  ? { width: "60%" }
                  : { width: "10%" }
              }
            />
          ))}
        </DataTable>
      </div>

      {/* Paginator */}
      <CustomPaginator
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        maxButtons={5}
      />
    </div>
  );
}

export default UserRolesPermissions;
