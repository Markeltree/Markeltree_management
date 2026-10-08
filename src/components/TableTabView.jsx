import React, { useState } from "react";
import { ActionButton, CustomPaginator } from "@/common/imports";
// import CustomPaginator from "./CustomPaginator"; // Adjust the import path as needed

export default function TableTabView({
  tabs,
  defaultActiveIndex = 0,
  tabLabelClass = "",
  activeTabClass = "",
  inactiveTabClass = "",
  tabHeaderClass = "",
  contentContainerClass = "",
  tableWrapperClass = "",
}) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const activeTab = tabs[activeIndex];
  const totalRows = activeTab?.table?.rows?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = activeTab?.table?.rows?.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleTabChange = (idx) => {
    setActiveIndex(idx);
    setCurrentPage(1);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start">
      {/* Tab Headers */}
      <div className={`flex ${tabHeaderClass}`}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`${tabLabelClass} ${
              idx === activeIndex ? activeTabClass : inactiveTabClass
            } flex items-center gap-2`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="bg-[#09BF641A] text-[#09BF64] dark:bg-[#81D9591A] dark:text-[#81D959] text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`w-full ${contentContainerClass}`}>
        <div className={`w-full overflow-x-auto ${tableWrapperClass}`}>
          {activeTab?.table ? (
            <>
              <table className="w-full table-auto text-[13px] border-separate">
                <thead>
                  <tr>
                    {activeTab.table.columns.map((col, index) => (
                      <th
                        key={index}
                        className={`text-left px-3 py-2 text-[#33333380] dark:text-[#8E8E9C] font-normal text-[12px] whitespace-nowrap 
                          ${index !== 0 ? "hidden lg:table-cell" : "table-cell"}
                          ${index === 0 ? "w-[100%] lg:w-[45%]" : "lg:w-[14%]"}
                        `}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="bg-white dark:bg-black rounded-md align-middle"
                    >
                      {activeTab.table.columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-3 py-2 align-middle text-[12px] text-[#666666] dark:text-[#CECFFA] whitespace-nowrap border-b dark:border-[#6F7C7426]
                            ${
                              colIndex !== 0
                                ? "hidden lg:table-cell"
                                : "table-cell"
                            }
                          `}
                        >
                          {typeof row[col] === "object" &&
                          row[col]?.type === "button" ? (
                            <ActionButton
                              label={row[col].label}
                              buttonClass="text-[12px] px-2 py-1 bg-[#09BF641A] text-[#09BF64] dark:text-[#81D959] rounded"
                            />
                          ) : (
                            <span>{row[col]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Replace pagination buttons with your CustomPaginator */}
              {totalRows > rowsPerPage && (
                <div className="mt-4 items-center justify-center">
                  <CustomPaginator
                    totalPages={totalPages}
                    currentPage={currentPage - 1} // convert 1-based to 0-based index
                    onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)} // convert back to 1-based
                    maxButtons={5}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-[#999] mt-4">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
