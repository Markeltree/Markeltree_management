import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  RangeCalendar,
  AddCustomerModal,
  CustomerData,
  Skeleton,
  useState,
  useEffect,
} from "@/common/imports";

export default function Customers() {
  const { openModal, closeModal } = useModal();

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

  const AddCustomer = () => {
    openModal(AddCustomerModal, {
      sizeClass: "w-[85%] md:w-[60%]",
    });
  };

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

                {/* add customer Button Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                  style={{ borderRadius: "0.375rem" }}
                />
              </div>
            </div>
            <CustomerData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="hidden lg:block text-[14px] font-semibold text-[#0088D1] dark:text-[#0088D1] whitespace-nowrap">
                Customers
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
                  label="Add Customer"
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
                  buttonClass="text-[10px] md:text-[12px] flex items-center justify-center gap-2 h-[35px] md:h-[45px] w-auto px-2 md:px-4 bg-[#0088D1] text-white dark:bg-[#0088D1] dark:text-black border border-[#0088D1] focus:outline-none focus:ring-0"
                  onClick={AddCustomer}
                />
              </div>
            </div>

            {/* row 3 Table */}
            <CustomerData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
