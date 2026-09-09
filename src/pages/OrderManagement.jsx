import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  RangeCalendar,
  OrderManagementData,
  ShareFeedbackModal,
  Skeleton,
  useState,
  FlexibleCard,
  useEffect,
  MenuActionButton,
  PinWrapper,
  menuOptions,
  AddNewOrderModal,
} from "@/common/imports";
import React from "react";

export default function OrderManagement() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions();

  const addNewOrder = () => {
    openModal(AddNewOrderModal, {
      sizeClass: "w-[85%] md:w-[60%]",
    });
  };

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

  const OrderTopCardSkeleton = () => (
    <div className="grid grid-cols-5 gap-4 mb-2 justify-center w-full pt-4">
      {/* Card 1 */}
      <div className="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-col gap-3">
            <Skeleton
              width="80px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="56px"
            height="55px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-col gap-3">
            <Skeleton
              width="90px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="56px"
            height="55px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-col gap-3">
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="56px"
            height="55px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>

      {/* Card 4 */}
      <div className="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-col gap-3">
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="56px"
            height="55px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>

      {/* Card 5 */}
      <div className="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-col gap-3">
            <Skeleton
              width="110px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="24px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="56px"
            height="55px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        {isLoading ? (
          <>
            {/* Row 1 - Header + Buttons */}
            <OrderTopCardSkeleton />
            {/* Row 2 - Cards */}
            <OrderManagementData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#5D5FEF] dark:text-[#5D5FEF] whitespace-nowrap">
                Order Management
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-between md:justify-end items-center gap-1 sm:gap-4 w-full">
                {/* Export Button */}
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
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
                  buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                  iconClass="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
                  onClick={handleRefresh}
                />

                {/* add new order Button */}
                <ActionButton
                  label="Add New Order"
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
                  onClick={addNewOrder}
                  buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-4 bg-[#5D5FEF] text-white dark:bg-[#5D5FEF] dark:text-black border border-[#5D5FEF] focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            {/* row 2 */}
            <div className="grid grid-cols-5 gap-4 mb-2 justify-center pt-4">
              {/* card 1 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                          Total Orders
                        </h2>
                        <h1 className="text-[24px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
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
              />
              {/* card 2 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                          Pending Orders
                        </h2>
                        <h1 className="text-[24px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
                          512
                        </h1>
                      </div>
                      <div className="pt-2">
                        <img
                          src="/icons/PendingOrderIcon.png"
                          alt="Total SKUs"
                          width="56px"
                          height="55px"
                        />
                      </div>
                    </div>
                  </>
                }
              />

              {/* card 3 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                          In Transit Orders
                        </h2>
                        <h1 className="text-[24px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
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
              />

              {/* card 4 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                          Cancelled Orders
                        </h2>
                        <h1 className="text-[24px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
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
              />

              {/* card 5 */}
              <FlexibleCard
                cardClass="flex flex-col w-full col-span-5 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass=""
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                          Completed Orders
                        </h2>
                        <h1 className="text-[24px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
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
              />
            </div>

            {/* row 3 Table */}
            <OrderManagementData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
