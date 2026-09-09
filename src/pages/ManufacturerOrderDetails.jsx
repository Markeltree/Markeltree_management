import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  ManufacturerOrderDetailsData,
  Skeleton,
  useState,
  useEffect,
  MenuActionButton,
  EditCustomerModal,
  menuOptions,
} from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function ManufacturerOrderDetails() {
  const { openModal, closeModal } = useModal();

  const [key, setKey] = useState(0);
  const exportMenuOptions = menuOptions();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const [isLoading, setIsLoading] = useState(true);

  const editManufacturer = () => {
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
              <div className="flex flex-row justify-end items-center gap-2 md:gap-4 w-full md:w-[50%]">
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
              <div className="flex flex-row justify-between gap-3 w-full">
                {/* Skeleton for Title */}
                <Skeleton
                  width="180px"
                  height="20px"
                  className="rounded dark:bg-[#2C2C2CAA]"
                />

                {/* Skeleton for Button */}
                <div className="flex items-center gap-2">
                  <Skeleton
                    width="60px"
                    height="28px"
                    className="rounded dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>
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
            {/* row 3 */}
            <div className="flex flex-col gap-4 mb-2 justify-between bg-white dark:bg-black rounded-lg p-6">
              {/* Header Skeleton */}
              <div className="flex flex-row justify-between gap-3 w-full">
                <Skeleton
                  width="150px"
                  height="20px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="70px"
                  height="25px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Card Skeleton */}
              <div className="border p-2 border-grey-200 dark:border-[#73779180] rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 justify-between gap-4">
                  {/* PO Number */}
                  <div className="flex flex-col col-span-1 lg:col-span-2 gap-2 lg:gap-4">
                    <Skeleton
                      width="60px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="80px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Total Pallets */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <Skeleton
                      width="80px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="50px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Total Units */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <Skeleton
                      width="70px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="60px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Total Amount */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <Skeleton
                      width="80px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="70px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Loading Date */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <Skeleton
                      width="70px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Received Date */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <Skeleton
                      width="80px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="15px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-2">
                    <Skeleton
                      width="60px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <div className="flex items-center gap-2">
                      <Skeleton
                        width="15px"
                        height="15px"
                        shape="circle"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="120px"
                        height="15px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ManufacturerOrderDetailsData isLoading={true} key={key} />;
          </>
        ) : (
          <>
            {/* Row 1: Main Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              {/* Title (Hidden below lg) */}
              <h1 className="flex w-full  justify-start items-center text-[14px] font-semibold text-[#5D5FEF] dark:text-[#5D5FEF] whitespace-nowrap">
                <button
                  onClick={() => navigate("/manufacturer")}
                  className="flex items-center text-[#5D5FEF] dark:text-[#5D5FEF] hover:underline"
                >
                  Manufacturer
                </button>
                <Icon
                  icon="mdi:chevron-right"
                  className="mx-1 text-[#5D5FEF] dark:text-[#5D5FEF]"
                  width="16"
                  height="16"
                />
                Order Detail
              </h1>

              {/* Buttons Container */}
              <div className="flex flex-wrap justify-end items-center gap-2 md:gap-4 w-full">
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[16px] h-[14px]"
                />
                {/* Refresh Button */}
                <ActionButton
                  label="Refresh"
                  iconLight="./refreshIcon.png"
                  iconDark="./refreshIcon.png"
                  iconPos="left"
                  labelClass="font-normal md:font-bold"
                  buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-2 md:px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                  iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                  onClick={handleRefresh}
                />
              </div>
            </div>
            {/* Row 2: Cards */}
            <div className="flex flex-col gap-4 mb-2 justify-between bg-white dark:bg-black rounded-lg p-6">
              <div className="flex flex-row justify-between  gap-3 w-full">
                <h1 className="text-[15px] md:text-[18px] text-[#333333] dark:text-[#F2F2FE] font-extrabold">
                  Manufacturer Details
                </h1>
                <button
                  onClick={editManufacturer}
                  type="button"
                  className="flex items-center gap-2 bg-white dark:bg-black text-[#5D5FEF] dark:text-[#7476F1] border border-[#5D5FEF] dark:border-[#7476F1] px-3 py-1 rounded text-[11px] font-medium"
                >
                  <Icon icon="tabler:edit" width={14} height={14} /> Edit
                </button>
              </div>
              <div className="grid grid-cols-3 justify-between gap-4">
                <div className="flex flex-col col-span-1  gap-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Manufacturer Name
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Shraiy Gupta
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Mobile Number
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    +91 5435345
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Email Address
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    shraiy@gmail.com
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 justify-between gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Post Code
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    656675
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Payment Terms
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    7 Days
                  </p>
                </div>

                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Bank Transfer
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Metro
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 justify-between gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                    Address
                  </h2>
                  <p className="text-[12px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    Noida, India
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3: Cards */}

            <div className="flex flex-col gap-4 mb-2 justify-between bg-white dark:bg-black rounded-lg p-6">
              <div className="flex flex-row justify-between  gap-3 w-full">
                <h1 className="text-[15px] md:text-[18px] text-[#333333] dark:text-[#F2F2FE] font-extrabold">
                  PO Summary
                </h1>
                <button
                  //   onClick={editCustomer}
                  type="button"
                  className="flex items-center gap-2 bg-white dark:bg-black text-[#5D5FEF] dark:text-[#7476F1] border border-[#5D5FEF] dark:border-[#7476F1] px-3 py-1 rounded text-[11px] font-medium"
                >
                  <Icon icon="tabler:edit" width={14} height={14} /> Edit
                </button>
              </div>
              <div className="border p-3 border-grey-200 dark:border-[#73779180] rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 justify-between gap-4">
                  <div className="flex flex-col col-span-1 lg:col-span-2  gap-2 lg:gap-4">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      PO Number
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      #3561
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Total Pallets
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      34
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Total Units
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      € 3534
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Total Amount
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      € 35,334
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Loading Date
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      12/12/2025
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-1">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Received Date
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      12/12/2025
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:gap-4 col-span-2">
                    <h2 className="text-[7px] md:text-[10px] text-[#737791] dark:text-[#8E8E9C]">
                      Status
                    </h2>
                    <div className="flex items-center space-x-1 w-full">
                      <Icon
                        icon="lsicon:check-correct-filled"
                        className="text-green-600 flex-shrink-0"
                      />
                      <span className="truncate text-[10px] md:text-[13px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                        Sent to Manufacturer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* row 4 Table */}
            <ManufacturerOrderDetailsData isLoading={isLoading} key={key} />

            <div className="pb-5"></div>
          </>
        )}
      </div>
    </>
  );
}
