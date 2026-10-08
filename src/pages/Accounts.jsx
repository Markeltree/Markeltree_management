import { useModal } from "@/context/ModalContext";

import {
  useEffect,
  useState,
  ActionButton,
  RangeCalendar,
  FlexibleCard,
  menuOptions,
  Skeleton,
  AccountsData,
  Icon,
  MenuActionButton,
  GenerateInvoiceModal,
} from "@/common/imports";

export default function Accountst() {
  const exportMenuOptions = menuOptions();
  const { openModal, closeModal } = useModal();

  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const generateInvoice = () => {
    openModal(GenerateInvoiceModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // show skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000); // simulate loading
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {isLoading ? (
          <>
            {/* Row 1: Header + Buttons */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title */}
              <Skeleton
                width="80px"
                height="20px"
                className="hidden lg:block dark:bg-[#2C2C2CAA]"
              />

              {/* Buttons Container */}
              <div className="flex flex-row justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
                {/* Export Button */}
                <Skeleton
                  width="104px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                {/* RangeCalendar */}
                <Skeleton
                  width="195px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                {/* Refresh Button */}
                <Skeleton
                  width="126px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                {/* Generate Invoice */}
                <Skeleton
                  width="175px"
                  height="45px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <div className="grid grid-cols-12 gap-4 mb-2 justify-center">
              {/* Card 1 */}
              <div className="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-transparent rounded-xl">
                <Skeleton
                  width="100%"
                  height="120px"
                  className="dark:bg-[#2C2C2CAA] rounded-xl"
                />
              </div>

              {/* Card 2 */}
              <div className="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-transparent rounded-xl">
                <Skeleton
                  width="100%"
                  height="120px"
                  className="dark:bg-[#2C2C2CAA] rounded-xl"
                />
              </div>

              {/* Card 3 */}
              <div className="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-transparent rounded-xl">
                <Skeleton
                  width="100%"
                  height="120px"
                  className="dark:bg-[#2C2C2CAA] rounded-xl"
                />
              </div>
            </div>
            <AccountsData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64] whitespace-nowrap">
                Accounts
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
                  label="Generate Invoice"
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
                  onClick={generateInvoice}
                  buttonClass="flex items-center justify-center gap-2 text-[8px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 md:px-4 bg-[#09BF64] text-white dark:bg-[#09BF64] dark:text-black border border-[#09BF64] focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Row 2: Cards */}
            <div className="grid grid-cols-12 gap-4 mb-2 justify-center">
              {/* card 1 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Total Revenue
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          $1,245
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalReportIcon.png"
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
                        2% more than last year
                      </h2>
                    </div>
                  </>
                }
              />

              {/* card 2 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Total Expense
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          $512
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/TotalExpenseIcon.png"
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
                  </>
                }
              />

              {/* card 3 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-12 lg:col-span-4 h-[120px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[12px]">
                          Pending Invoices
                        </h2>
                        <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                          34
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/PendingInvoiceIcon.png"
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
                        Amount Due: {""}{" "}
                        <span className="text-[#EF4444]">$4,564</span>
                      </h1>
                    </div>
                  </>
                }
              />
            </div>

            {/* row 3 Table */}
            <AccountsData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
