import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  RangeCalendar,
  FlexibleCard,
  MiniTrendArrowChart,
  SolidGaugeChart,
  CurveLineChart,
  InventoryManagementData,
  UpdateInventoryModal,
  Skeleton,
  useState,
  useEffect,
} from "@/common/imports";

export default function InventoryManagement() {
  const [key, setKey] = useState(0);
  const { openModal, closeModal } = useModal();

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const updateInventory = () => {
    openModal(UpdateInventoryModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // show skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000); // simulate loading
    return () => clearTimeout(timer);
  }, [key]);

  const CardSkeleton = () => (
    <div className="grid grid-cols-12 gap-4 mb-2 justify-center pt-4">
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col w-full col-span-12 md:col-span-6 lg:col-span-3 h-[182px] bg-white dark:bg-black rounded-xl"
        >
          {/* Header */}
          <div className="flex flex-col justify-between gap-2 pl-4 pt-4">
            <Skeleton
              className="dark:bg-[#2C2C2CAA]"
              shape="circle"
              width="40px"
              height="40px"
              style={{ borderRadius: "0.375rem" }}
            />
            <Skeleton
              width="120px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Center */}
          <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4 mt-auto mb-4">
            <div className="flex flex-col gap-2">
              <Skeleton
                width="80px"
                height="30px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            {/* Placeholder for chart */}
            <Skeleton
              width="90px"
              height="90px"
              className="dark:bg-[#2C2C2CAA]"
              style={{ borderRadius: "0.5rem" }}
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
                {/* RangeCalendar Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                />

                {/* Refresh Button Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[100px]"
                  style={{ borderRadius: "0.375rem" }}
                />

                {/* Add Stock Button Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                  style={{ borderRadius: "0.375rem" }}
                />
              </div>
            </div>
            {/* row-2 */}
            <CardSkeleton />
            <InventoryManagementData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#0088D1] dark:text-[#0088D1] whitespace-nowrap">
                Inventory Management
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
                {/* RangeCalendar */}
                <div className="w-auto h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] flex items-center justify-center">
                  <RangeCalendar
                    icon="pi pi-calendar"
                    placeholder="Select date range"
                    labelClass="font-normal md:font-bold"
                    buttonStyling="h-[35px] md:h-[45px] w-auto text-[10px] md:text-[12px] px-4 rounded-md"
                    gapClasses="gap-1 sm:gap-2"
                    dropdownClass="w-[340px] sm:w-[420px] text-[8px] sm:text-xs overflow-hidden left-[unset] sm:left-0 sm:right-0  sm:translate-x-0"
                  />
                </div>

                {/* Refresh Button */}
                <ActionButton
                  label="Refresh"
                  iconLight="./refreshIcon.png"
                  iconDark="./refreshIcon.png"
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-2 md:px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
                  iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                  onClick={handleRefresh}
                />

                {/* Add Stock */}
                <ActionButton
                  label="Add Stock"
                  iconLight={
                    <Icon
                      icon="material-symbols:add-rounded"
                      className="w-[14px] md:w-[18px] h-[14px] md:h-[18px] text-white"
                    />
                  }
                  iconDark={
                    <Icon
                      icon="material-symbols:add-rounded"
                      className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                    />
                  }
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  onClick={updateInventory}
                  buttonClass="text-[10px] md:text-[12px] flex items-center justify-center gap-2 h-[35px] md:h-[45px] w-auto px-2 md:px-4 bg-[#0088D1] text-white dark:bg-[#0088D1] dark:text-black border border-[#0088D1] focus:outline-none focus:ring-0"
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
                      <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#22C55E0F] rounded-md">
                        <Icon
                          icon="solar:dollar-broken"
                          width="20"
                          height="20"
                          className="text-[#22C55E]"
                        />
                      </button>
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Total Inventory Value
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        £13.000
                      </h1>
                      <h2 className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                        50% than last Week
                      </h2>
                    </div>
                    <MiniTrendArrowChart
                      data={[1, 3, 5, 5, 4, 7, 6, 8]}
                      trend="up"
                    />
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
                      <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#2291C50F] rounded-md">
                        <Icon
                          icon="fluent:box-20-regular"
                          width="20"
                          height="20"
                          className="text-[#2291C5]"
                        />
                      </button>
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Number of Items
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        $13.000
                      </h1>
                      <h2 className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                        50% out of 100%
                      </h2>
                    </div>
                    <SolidGaugeChart
                      value={72}
                      centerText=""
                      height="85"
                      width="85"
                      gradientColors={[
                        [0, "#95CAE3"],
                        [1, "#2291C5"],
                      ]}
                      valueStyle="font-size:14px; font-weight:bold; color:#2291C5;"
                      textStyle=""
                      outerRadius="100%"
                      innerRadius="80%"
                    />
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
                      <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#C522250F] rounded-md">
                        <Icon
                          icon="weui:error-outlined"
                          width="20"
                          height="20"
                          className="text-[#C52225]"
                        />
                      </button>
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        Stock Out Rate
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        2%
                      </h1>
                      <h2 className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                        50% Lower
                      </h2>
                    </div>
                    <MiniTrendArrowChart
                      data={[8, 6, 7, 4, 5, 3, 1]}
                      trend="down"
                    />
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
                      <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#C594220F] rounded-md">
                        <Icon
                          icon="ion:time-outline"
                          width="20"
                          height="20"
                          className="text-[#C59422]"
                        />
                      </button>
                      <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                        DOH(Days on hand)
                      </h2>
                    </div>
                  </>
                }
                center={
                  <div className="flex flex-row justify-between items-center gap-4 pl-4 pr-4">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-extrabold text-[24px] text-[#0B1B33] dark:text-[#EAF6FC]">
                        1 Week
                      </h1>
                      <h2 className="text-[#00000066] text-[10px] dark:text-[#FFFFFFCC] whitespace-nowrap">
                        50% than last Week
                      </h2>
                    </div>
                    <CurveLineChart
                      data={[1, 3, 5, 2, 7]}
                      color="#C59422"
                      width={65}
                      height={80}
                    />
                  </div>
                }
              />
            </div>

            {/* row 3 Table */}
            <InventoryManagementData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
