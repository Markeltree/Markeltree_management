import { useModal } from "@/context/ModalContext";
import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useState,
  ActionButton,
  RangeCalendar,
  FlexibleCard,
  menuOptions,
  ProductManagementData,
  Skeleton,
  MenuActionButton,
} from "@/common/imports";

export default function ProductManagement() {
  const exportMenuOptions = menuOptions();
  const navigate = useNavigate();

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

  const ProductCardSkeleton = () => (
    <div className="grid grid-cols-12 gap-4 mb-2 justify-center pt-4">
      {/* Card Skeletons */}
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-[#2C2C2CAA] rounded-xl"
        >
          {/* Header Skeleton */}
          <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
            <Skeleton
              width="56px"
              height="55px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Center Skeleton */}
          <div className="flex flex-col justify-between gap-2 pl-4 pr-4 pt-4">
            <Skeleton
              width="50px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="120px"
              height="10px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Footer Skeleton */}
          <div className="flex justify-between items-center w-full pl-4 pr-4 pt-2">
            <Skeleton
              width="150px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="80px"
              height="16px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {isLoading ? (
          <>
            {/* Row 1: Header + Buttons */}
            <div className="flex flex-row justify-end lg:justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <div className="hidden lg:block">
                <Skeleton
                  width="160px"
                  height="20px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Buttons Container */}
              <div className="flex flex-row justify-between sitems-center gap-2 md:gap-4 w-full md:w-[50%]">
                {/* export Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                />

                {/* RangeCalendar Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[100px]"
                  style={{ borderRadius: "0.375rem" }}
                />

                {/* refresh Button Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                  style={{ borderRadius: "0.375rem" }}
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <ProductCardSkeleton />
            <ProductManagementData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#0088D1] dark:text-[#0088D1] whitespace-nowrap">
                Product Management
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
                {/* Export Button */}
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
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
                  iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                  onClick={handleRefresh}
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <div className="grid grid-cols-12 gap-4 mb-2 justify-center pt-4">
              {/* card 1 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
                      <img
                        src="/icons/TotalSKUIcon.png"
                        alt="Total SKUs"
                        width="56px"
                        height="55px"
                      />
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Total SKUs
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4 pt-1">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        25
                      </h1>
                      <h2 className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                        8 less than last month
                      </h2>
                    </div>
                  </div>
                }
              />
              {/* card 2 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
                      <img
                        src="/icons/LowStockSKUIcon.png"
                        alt="Total SKUs"
                        width="56px"
                        height="55px"
                      />
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Low Stock SKUs
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4 pt-1">
                    <div className="flex flex-col gap-2 w-full">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        8
                      </h1>

                      {/* This row will now actually stretch across */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                          out of stock on next week
                        </p>
                        <button
                          type="button"
                          className="text-[12px] text-[#0088D1] dark:text-[#01CEE9] whitespace-nowrap hover:underline"
                          onClick={() => {
                            navigate("/lowstock");
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                }
              />

              {/* card 3 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
                      <img
                        src="/icons/OutOfStockIcon.png"
                        alt="Total SKUs"
                        width="56px"
                        height="55px"
                      />
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Out of Stock SKUs
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4 pt-1">
                    <div className="flex flex-col gap-2 w-full">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        2
                      </h1>

                      {/* This row will now actually stretch across */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                          Since last week
                        </p>
                        <button
                          type="button"
                          className="text-[12px] text-[#0088D1] dark:text-[#01CEE9] whitespace-nowrap hover:underline"
                          onClick={() => {
                            navigate("/outofstock");
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                }
              />

              {/* card 4 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
                      <img
                        src="/icons/NearExpiryIcon.png"
                        alt="Total SKUs"
                        width="56px"
                        height="55px"
                      />
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Near Expiry Stock SKUs
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4 pt-1">
                    <div className="flex flex-col gap-2 w-full">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        3
                      </h1>

                      {/* This row will now actually stretch across */}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                          Expiring Within 7 Months
                        </p>
                        <button
                          type="button"
                          className="text-[12px] text-[#0088D1] dark:text-[#01CEE9] whitespace-nowrap hover:underline"
                          onClick={() => {
                            navigate("/nearexpiry");
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* row 3 Table */}
            <ProductManagementData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
