import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  CustomerDetailsData,
  Skeleton,
  useState,
  useEffect,
  MenuActionButton,
  EditCustomerModal,
  menuOptions,
} from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function CustomerDetails() {
  const { openModal, closeModal } = useModal();

  const [key, setKey] = useState(0);
  const exportMenuOptions = menuOptions();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const [isLoading, setIsLoading] = useState(true);

  const editCustomer = () => {
    openModal(EditCustomerModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  useEffect(() => {
    setIsLoading(true); // show skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000); // simulate loading
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <>
      {/* Main  */}
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

                {/* export Button Skeleton */}
                <Skeleton
                  height="45px"
                  className="dark:bg-[#2C2C2CAA] w-[120px]"
                  style={{ borderRadius: "0.375rem" }}
                />
              </div>
            </div>
            {/* row-2 */}
            <div className="flex flex-col gap-4 mb-2 justify-between bg-white dark:bg-black rounded-lg p-6">
              {/* Row 1 */}
              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="40%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="80%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="40%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="70%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="40%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="90%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="col-span-1 flex justify-end items-start">
                  <Skeleton
                    width="60px"
                    height="25px"
                    className="rounded dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="40%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="50%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="50%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="60%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="60%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="70%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col col-span-1 gap-1">
                  <Skeleton
                    width="40%"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="80%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>
            </div>
            <CustomerDetailsData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="flex w-full  justify-start items-center text-[14px] font-semibold text-[#0088D1] dark:text-[#0088D1] whitespace-nowrap">
                <button
                  onClick={() => navigate("/customer")}
                  className="flex items-center text-[#0088D1] dark:text-[#0088D1] hover:underline"
                >
                  Customer
                </button>
                <Icon
                  icon="mdi:chevron-right"
                  className="mx-1 text-[#0088D1] dark:text-[#0088D1]"
                  width="16"
                  height="16"
                />
                Customer Name
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-end items-center gap-2 md:gap-4 w-full">
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

                {/* export*/}
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] sm:text-[12px] md:text-sm h-[35px] md:h-[45px] w-auto px-2 md:px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[12px] h-[10px] xs:w-[13px] xs:h-[11px] sm:w-[14px] sm:h-[12px] md:w-[16px] md:h-[14px]"
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <div className="flex flex-col gap-4 mb-2 justify-between bg-white dark:bg-black rounded-lg p-6">
              <div className="flex flex-row justify-between  gap-3 w-full">
                <h1 className="text-[15px] md:text-[18px] text-[#333333] dark:text-[#EEF8FD] font-extrabold">
                  Customer Details
                </h1>
                <button
                  onClick={editCustomer}
                  type="button"
                  className="flex items-center gap-2 bg-white dark:bg-black text-[#0088D1] dark:text-[#01CEE9] border border-[#0088D1] dark:border-[#01CEE9] px-3 py-1 rounded text-[11px] font-medium"
                >
                  <Icon icon="tabler:edit" width={14} height={14} /> Edit
                </button>
              </div>

              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col col-span-1  gap-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Customer Name
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Shraiy Gupta
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Mobile Number
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    +91 5435345
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Email Address
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    shraiy@gmail.com
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Post Code
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    656675
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Payment Terms
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    7 Days
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Bank Transfer
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Metro
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 justify-between gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#6E7A86] dark:text-[#8E8E9C]">
                    Address
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Noida, India
                  </p>
                </div>
              </div>
            </div>
            {/* row 3 Table */}
            <CustomerDetailsData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
