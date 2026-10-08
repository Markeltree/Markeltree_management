import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  RangeCalendar,
  LogisticsData,
  Skeleton,
  useState,
  useEffect,
  FlexibleCard,
  menuOptions,
  MenuActionButton,
} from "@/common/imports";
import React from "react";

export default function Logistics() {
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

  const CardSkeleton = () => (
    <div className="grid grid-cols-12 gap-4 mb-2 justify-center pt-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[120px] bg-white dark:bg-black rounded-xl"
        >
          {/* Card Header */}
          <div className="flex flex-row gap-2 p-4 w-full justify-between">
            <div className="flex flex-col gap-3">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="60px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <Skeleton
              width="56px"
              height="55px"
              className="rounded-md dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Card Center */}
          <div className="px-4 pb-4">
            {/* Text */}
            <Skeleton
              width="100%"
              height="10px"
              className="mb-1 dark:bg-[#2C2C2CAA]"
            />
            {/* Progress Bar */}
            {i === 0 && (
              <Skeleton
                width="100%"
                height="5px"
                className="rounded-full dark:bg-[#2C2C2CAA]"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        {isLoading ? (
          <>
            {/* Row 1: Header + Buttons */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (hidden below lg) */}
              <div className="hidden lg:block">
                <Skeleton
                  width="100px"
                  height="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
                {/* Export Button */}
                <Skeleton
                  width="75px"
                  height="35px"
                  className="md:w-[104px] md:h-[45px] rounded-md dark:bg-[#2C2C2CAA]"
                />

                {/* RangeCalendar */}
                <Skeleton
                  width="135px"
                  height="35px"
                  className="md:w-[195px] md:h-[45px] rounded-md dark:bg-[#2C2C2CAA]"
                />

                {/* Refresh Button */}
                <Skeleton
                  width="75px"
                  height="35px"
                  className="md:w-[126px] md:h-[45px] rounded-md dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
            {/* Row 2: KPI Cards */}
            <CardSkeleton />
            {/* row 3 Table */}
            <LogisticsData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64] whitespace-nowrap">
                Logistics
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
                {/* export button */}
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                />

                {/* RangeCalendar */}
                <div className="w-auto h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] flex items-center justify-center">
                  <RangeCalendar
                    icon="pi pi-calendar"
                    placeholder="Select date range"
                    labelClass="font-normal md:font-bold"
                    buttonStyling="h-[35px] md:h-[45px] w-auto text-[10px] md:text-[12px] px-4 rounded-md"
                    gapClasses="gap-1 sm:gap-2"
                    dropdownClass="
                                w-[340px] sm:w-[420px] text-[8px] sm:text-xs overflow-hidden
                                left-[unset] sm:left-0 -translate-x-24
                                md:left-auto md:right-0 md:translate-x-0
                            "
                  />
                </div>

                {/* Refresh Button */}
                <ActionButton
                  label="Refresh"
                  iconLight="./refreshIcon.png"
                  iconDark="./refreshIcon.png"
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                  iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                  onClick={handleRefresh}
                />
              </div>
            </div>

            {/* Row 2: Cards */}
            <div className="grid grid-cols-12 gap-4 mb-2 justify-center pt-4">
              {/* card 1 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Total Delivery
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          1,245
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalSKUIcon.png"
                          alt="Total SKUs"
                          width="56px"
                          height="55px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <div className="w-full pl-4 pr-4 pb-4">
                    {/* Text */}
                    <p className="text-[8px] font-normal text-[#A9C2B3] mb-1">
                      780/1,000 Completed Today
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-[5px]">
                      <div
                        className="bg-[#0CB91D] dark:bg-[#0DD121] h-[5px] rounded-full transition-all duration-300"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                }
              />
              {/* card 2 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          In Transit
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          512
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/InTransitIcon.png"
                          alt="Total SKUs"
                          width="56px"
                          height="55px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="text-[10px] pl-4 pr-4 pb-4">
                      <h1 className="text-[#00000066] dark:text-[#999999]">
                        <span className="text-[#0CB91D]">95%</span> On-Time
                        Deliveries
                      </h1>
                    </div>
                  </>
                }
              />

              {/* card 3 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Delivery Delayed
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          78
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/DeliveryDelayedIcon.png"
                          alt="Total SKUs"
                          width="56px"
                          height="55px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="text-[10px] pl-4 pr-4 pb-4">
                      <h1 className="text-[#00000066] dark:text-[#999999]">
                        Average delay:{" "}
                        <span className="text-[#EF4444]">30 mins</span>
                      </h1>
                    </div>
                  </>
                }
              />

              {/* card 4 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Delivery Success
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          92%
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/DeliverySuccessIcon.png"
                          alt="Total SKUs"
                          width="56px"
                          height="55px"
                        />
                      </div>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="text-[10px] pl-4 pr-4 pb-4">
                      <h1 className="text-[#00000066] dark:text-[#999999]">
                        <span className="text-[#0CB91D]">Goal: </span> 95%
                        Success Rate
                      </h1>
                    </div>
                  </>
                }
              />
            </div>

            {/* row 3 Table */}
            <LogisticsData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
