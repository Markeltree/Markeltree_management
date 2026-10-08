import { useModal } from "@/context/ModalContext";

import {
  Icon,
  ActionButton,
  RangeCalendar,
  ReportData,
  Skeleton,
  useState,
  useEffect,
  FlexibleCard,
  menuOptions,
  GenerateReportModal,
  MenuActionButton,
} from "@/common/imports";
import React from "react";

export default function Reporting() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions();

  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // show skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000); // simulate loading
    return () => clearTimeout(timer);
  }, [key]);

  const handleGenerateReport = () => {
    openModal(GenerateReportModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        {isLoading ? (
          <>
            {/* Row 1: Title + Buttons */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (hidden below lg) */}
              <Skeleton
                width="100px"
                height="18px"
                className="hidden lg:block dark:bg-[#2C2C2CAA]"
              />

              {/* Buttons Container */}
              <div className="flex flex-row justify-between md:justify-end items-center gap-1 sm:gap-4 w-full">
                {/* Export Button */}
                <Skeleton
                  width="104px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] rounded-md"
                />
                {/* RangeCalendar */}
                <Skeleton
                  width="120px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] rounded-md"
                />
                {/* Refresh Button */}
                <Skeleton
                  width="126px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] rounded-md"
                />
                {/* Generate Report Button */}
                <Skeleton
                  width="180px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] rounded-md"
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <div className="grid grid-cols-5 gap-4 mb-2 justify-center">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl p-4"
                >
                  {/* Header */}
                  <div className="flex flex-row gap-2 w-full justify-between">
                    <div className="flex flex-col gap-3">
                      <Skeleton
                        width="60px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="80px"
                        height="24px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                    <Skeleton
                      width="50px"
                      height="50px"
                      className="dark:bg-[#2C2C2CAA] rounded-full"
                    />
                  </div>

                  {/* Center */}
                  <div className="pt-4">
                    <Skeleton
                      width="100px"
                      height="12px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <ReportData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64] whitespace-nowrap">
                Reporting
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 w-full">
                {/* Export Button */}
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[8px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 md:px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[12px] h-[10px] xs:w-[13px] xs:h-[11px] sm:w-[14px] sm:h-[12px] md:w-[16px] md:h-[14px]"
                />

                {/* RangeCalendar */}
                <div className="w-auto h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] flex items-center justify-center">
                  <RangeCalendar
                    icon="pi pi-calendar"
                    placeholder="Select date range"
                    labelClass="font-normal md:font-bold"
                  />
                </div>

                {/* Refresh Button */}
                <ActionButton
                  label="Refresh"
                  iconLight="./refreshIcon.png"
                  iconDark="./refreshIcon.png"
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[8px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 md:px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                  iconClass="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
                  onClick={handleRefresh}
                />

                {/* generate report */}
                <ActionButton
                  label="Generate Report"
                  iconLight={
                    <Icon
                      icon="ic:round-add"
                      className="w-[12px] h-[12px] xs:w-[13px] xs:h-[13px] sm:w-[15px] sm:h-[15px] md:w-[18px] md:h-[18px]"
                    />
                  }
                  iconDark={
                    <Icon
                      icon="ic:round-add"
                      className="w-[12px] h-[12px] xs:w-[13px] xs:h-[13px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
                    />
                  }
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[8px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 md:px-4 bg-[#09BF64] text-white dark:bg-[#09BF64] dark:text-black border border-[#09BF64] focus:outline-none focus:ring-0"
                  onClick={handleGenerateReport}
                />
              </div>
            </div>

            {/* Row 2: Cards */}
            <div className="grid grid-cols-5 gap-4 mb-2 justify-center">
              {/* card 1 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Total
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          $1,245
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalReportIcon.png"
                          alt="Total SKUs"
                          width="50px"
                          height="50px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="pl-4 pr-4 pb-2">
                    <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[10px]">
                      <span className="text-[#0CB91D]">
                        <Icon
                          icon="clarity:arrow-line"
                          width="12"
                          height="14"
                          className="text-"
                        />
                      </span>
                      2% more than year
                    </h2>
                  </div>
                }
              />
              {/* card 2 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Total Sales
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          $512
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalSaleReportIcon.png"
                          alt="Total SKUs"
                          width="50px"
                          height="50px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="pl-4 pr-4 pb-2">
                    <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[10px]">
                      <span className="text-[#EF4444]">
                        <Icon
                          icon="solar:arrow-down-linear"
                          width="12"
                          height="14"
                          className="text-"
                        />
                      </span>
                      2% less than last year
                    </h2>
                  </div>
                }
              />

              {/* card 3 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Order Completed
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          34
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalSKUIcon.png"
                          alt="Total SKUs"
                          width="50px"
                          height="50px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="pl-4 pr-4 pb-2">
                    <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[10px]">
                      <span className="text-[#EF4444]">
                        <Icon
                          icon="solar:arrow-down-linear"
                          width="12"
                          height="14"
                          className="text-"
                        />
                      </span>
                      2% less than last year
                    </h2>
                  </div>
                }
              />

              {/* card 4 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Inventory Turnover
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          65%
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/InventoryTurnOverReportIcon.png"
                          alt="Total SKUs"
                          width="50px"
                          height="50px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="pl-4 pr-4 pb-2">
                    <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[10px]">
                      <span className="text-[#0CB91D]">
                        <Icon
                          icon="clarity:arrow-line"
                          width="12"
                          height="14"
                          className="text-"
                        />
                      </span>
                      2% more than year
                    </h2>
                  </div>
                }
              />

              {/* card 5 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Pending Shipments
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          92%
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/PendindShipmentReportIcon.png"
                          alt="Total SKUs"
                          width="50px"
                          height="50px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="pl-4 pr-4 pb-2">
                    <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[10px]">
                      <span className="text-[#0CB91D]">
                        <Icon
                          icon="clarity:arrow-line"
                          width="12"
                          height="14"
                          className="text-"
                        />
                      </span>
                      2% more than year
                    </h2>
                  </div>
                }
              />
            </div>

            {/* row 3 Table */}
            <ReportData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
