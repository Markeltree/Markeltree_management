import { useModal } from "@/context/ModalContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionButton,
  menuOptions,
  Icon,
  Skeleton,
  MenuActionButton,
  FlexibleCard,
} from "@/common/imports";

const AISuggestion = [
  {
    id: 1,
    title: "Cost Optimization",
    msg: "Current shipping cost with DHL: $150 | Alternative with GreatBear: $135 (Save $15).",
  },
  {
    id: 2,
    title: "Cost Optimization",
    msg: "Current shipping cost with DHL: $150 | Alternative with GreatBear: $135 (Save $15).",
  },
  {
    id: 3,
    title: "Cost Optimization",
    msg: "Current shipping cost with DHL: $150 | Alternative with GreatBear: $135 (Save $15).",
  },
  {
    id: 4,
    title: "Cost Optimization",
    msg: "Current shipping cost with DHL: $150 | Alternative with GreatBear: $135 (Save $15).",
  },
];

export default function LogisticDetails() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions(["CSV", "Excel"]);
  const navigate = useNavigate();

  const card =
    "bg-white dark:bg-[#0D0D0D] border border-[#E9E9EE] dark:border-[#2A2A2A] rounded-xl p-4";
  const label = "text-[12px] text-[#8E8E9C]";
  const title = "text-[14px] font-semibold text-[#0F2418] dark:text-white";

  const [isLoading, setIsLoading] = useState(true);

  const ActionButtonColor = ({ label, labelClass, buttonClass, ...props }) => {
    const labelColors = {
      Delivered: "bg-[#22C55E26] text-[#22C55E]",
      "In Transit": "bg-[#2794DD26] text-[#2794DD]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
      Delayed: "bg-[#FF695B26] text-[#FF695B]",
    };

    const appliedClass = labelColors[label] || labelColors.Default;

    return (
      <button {...props} className={`${buttonClass} ${appliedClass}`}>
        <span className={labelClass}>{label}</span>
      </button>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          {/* Title Skeleton */}
          <div className="flex w-full justify-start items-center whitespace-nowrap">
            <Skeleton
              width="80px"
              height="16px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              shape="circle"
              width="16px"
              height="16px"
              className="mx-1 dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="16px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Buttons Container Skeleton */}
          <div className="flex flex-wrap justify-end items-center gap-4 w-full">
            {/* Export Button Skeleton */}
            <Skeleton
              width="104px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
            {/* In Transit Button Skeleton */}
            <Skeleton
              width="140px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* ---------- LEFT SECTION (narrow) ---------- */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Row 1: Order Detail */}
            <div>
              <p className="text-[14px] font-medium text-[#6F7C74] dark:text-[#EFFBF3] pb-2">
                <Skeleton
                  width="100px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </p>
              <div className="flex flex-col h-[255px] bg-white dark:bg-black rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-row gap-2 justify-between mb-2">
                  <div className="flex flex-col gap-3">
                    <Skeleton
                      width="60px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="120px"
                      height="18px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <Skeleton
                    width="150px"
                    height="58px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <Skeleton
                  width="100%"
                  height="1px"
                  className="dark:bg-[#2C2C2CAA]"
                />

                {/* Center */}
                <div className="flex flex-row justify-between items-center flex-1 mt-4">
                  <div className="flex flex-row gap-4 flex-1">
                    {/* Left timeline */}
                    <div className="flex flex-col items-center gap-4">
                      <Skeleton
                        shape="circle"
                        width="24px"
                        height="24px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="1px"
                        height="20px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        shape="circle"
                        width="24px"
                        height="24px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                    {/* Dates */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Skeleton
                          width="60px"
                          height="11px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                        <Skeleton
                          width="90px"
                          height="14px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton
                          width="60px"
                          height="11px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                        <Skeleton
                          width="90px"
                          height="14px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Button */}
                  <Skeleton
                    width="120px"
                    height="45px"
                    className="dark:bg-[#2C2C2CAA] rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Carrier Details */}
            <div className="flex flex-col h-[232px] bg-white dark:bg-black rounded-xl">
              {/* Header */}
              <div className="p-4">
                <Skeleton
                  width="120px"
                  height="15px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              {/* Center */}
              <div className="flex justify-center px-4">
                <Skeleton
                  width="100%"
                  height="56px"
                  className="dark:bg-[#2C2C2CAA] rounded-lg"
                />
              </div>
              {/* Footer */}
              <div className="flex flex-col flex-1 justify-between p-4">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="30px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="40px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="80px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>
                <div>
                  <Skeleton
                    width="40px"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="150px"
                    height="14px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Codes */}
            <div className="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl">
              {/* Header */}
              <div className="pt-4 px-4 pb-2">
                <Skeleton
                  width="60px"
                  height="15px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              {/* Center */}
              <div className="flex flex-col gap-2 px-4 flex-1">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="40px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="60px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="70px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton
                      width="80px"
                      height="10px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="90px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Row 1: Product Info & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Info Card */}
              <div className="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl p-4">
                <Skeleton
                  width="100px"
                  height="15px"
                  className="mb-4 dark:bg-[#2C2C2CAA]"
                />
                <div className="flex flex-col gap-2">
                  {[1, 2].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-between w-full">
                      <Skeleton
                        width="80px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="100px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl p-4">
                <Skeleton
                  width="120px"
                  height="15px"
                  className="mb-4 dark:bg-[#2C2C2CAA]"
                />
                <div className="flex flex-col gap-2">
                  {[1, 2].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-between w-full">
                      <Skeleton
                        width="100px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="80px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                  ))}
                  <Skeleton
                    width="200px"
                    height="12px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: AI Powered Suggestions */}
            <div className="flex flex-col bg-white dark:bg-black rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton
                  shape="circle"
                  width="20px"
                  height="20px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="150px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="h-[265px] w-full overflow-y-auto space-y-4 pr-2 pb-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-auto bg-[#EFFBF380] dark:bg-[#14141480] rounded-xl p-4"
                  >
                    <Skeleton
                      width="100px"
                      height="12px"
                      className="mb-2 dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="80%"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Other Product Details */}
            <div className="flex flex-col h-[200px] bg-white dark:bg-black rounded-xl p-4">
              <Skeleton
                width="150px"
                height="15px"
                className="mb-4 dark:bg-[#2C2C2CAA]"
              />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-4 w-full">
                    {[1, 2, 3].map((_, colIndex) => (
                      <Skeleton
                        key={colIndex}
                        width="80px"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Inventory Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <h1 className="flex w-full  justify-start items-center text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64] whitespace-nowrap">
            <button
              onClick={() => navigate("/logistics")}
              className="flex items-center text-[#09BF64] dark:text-[#09BF64] hover:underline"
            >
              Logistic
            </button>
            <Icon
              icon="mdi:chevron-right"
              className="mx-1 text-[#09BF64] dark:text-[#09BF64]"
              width="16"
              height="16"
            />
            UA7345
          </h1>

          {/* Buttons Container */}
          <div className="flex flex-wrap justify-end items-center gap-4 w-full">
            {/* Export Button */}
            <MenuActionButton
              label="Export"
              iconLight="./exportIconLight.png"
              iconDark="./exportIconDark.png"
              iconPos="left"
              menuOptions={exportMenuOptions}
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[12px] h-[45px] w-[104px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
              menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
              iconClass="w-[16px] h-[16px]"
            />

            <ActionButtonColor
              label="In Transit"
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center rounded-lg justify-center gap-2 text-[12px] h-[45px] w-[140px] px-4 focus:outline-none focus:ring-0 transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]"
            />
          </div>
        </div>

        {/* ======= TWO-SECTIONS LAYOUT (Right wider than Left) ======= */}
        <div className="grid grid-cols-12 gap-4">
          {/* ---------- LEFT SECTION (narrow) ---------- */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Row 1: Order Detail */}
            <div>
              <p className="text-[14px] font-medium text-[#6F7C74] dark:text-[#EFFBF3] pb-2">
                Order Detail
              </p>
              <FlexibleCard
                cardClass="flex flex-col h-[255px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass=""
                footerClass=""
                header={
                  <>
                    <div className="flex flex-row gap-2 p-4 w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <h2 className="flex text-[#B0B0B0] dark:text-[#B0B0B0 text-[14px]">
                          Order ID
                        </h2>
                        <h1 className="text-[18px] text-black dark:text-white font-bold whitespace-nowrap">
                          EV-2017002346
                        </h1>
                      </div>
                      <div className="pt-3">
                        <img
                          src="/icons/truckIcon.png"
                          alt="truck"
                          width="150px"
                          height="58px"
                        />
                      </div>
                    </div>

                    <hr className="border-t border-[#E0E0E0] dark:border-[#2E2E2E] my-1 mx-2 w-[calc(100%-1rem)] " />
                  </>
                }
                center={
                  <>
                    <div className="flex flex-row px-4 py-4 gap-2 w-full justify-between items-center">
                      {/* Icons + Dates */}
                      <div className="flex flex-row gap-4 flex-1">
                        {/* Left timeline */}
                        <div className="flex flex-col items-center">
                          {/* Top green circle */}
                          <div>
                            <img
                              src="/icons/circleIcon.png"
                              alt="circle"
                              className="w-6 h-6 mt-1"
                            />
                          </div>
                          {/* Vertical line */}
                          <div className="flex-1 w-[1px] bg-[#E0E0E0] dark:bg-[#2E2E2E] my-1"></div>
                          {/* Bottom location icon */}
                          <img
                            src="/icons/locationIcon.png"
                            alt="location"
                            className="w-6 h-6 mt-1"
                          />
                        </div>

                        {/* Right text info */}
                        <div className="flex flex-col justify-between py-1 gap-2">
                          {/* Pickup Date */}
                          <div>
                            <p className="text-[11px] font-medium text-[#8E8E9C]">
                              Pickup Date
                            </p>
                            <h1 className="text-[14px] font-semibold text-black dark:text-white">
                              12/01/2025
                            </h1>
                          </div>

                          {/* Expected Delivery */}
                          <div>
                            <p className="text-[11px] font-medium text-[#8E8E9C] whitespace-nowrap">
                              Expected Delivery
                            </p>
                            <h1 className="text-[14px] font-semibold text-black dark:text-white">
                              12/01/2025
                            </h1>
                          </div>
                        </div>
                      </div>

                      {/* Button Section */}
                      <div>
                        <ActionButtonColor
                          label="In Transit"
                          labelClass="font-normal md:font-bold"
                          buttonClass="flex items-center rounded-lg justify-center gap-1 text-[12px] h-[45px] w-[120px] px-4 focus:outline-none focus:ring-0 transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]"
                        />
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            {/* Row 2: Carrier Details */}
            <div>
              <FlexibleCard
                cardClass="flex flex-col h-[232px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass="w-full"
                footerClass=""
                header={
                  <>
                    <div className="p-4">
                      <h1 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-semibold whitespace-nowrap">
                        Carrier Details
                      </h1>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="flex justify-center">
                      <div className="flex flex-row  gap-4 items-center h-[56px] w-[calc(100%-20px)] rounded-lg bg-[#EFF0F7] dark:bg-[#191919] p-4">
                        <img src="/walkerpackIcon.png" alt="walkerpack" />
                        <h1 className="text-[#0E1A12] text-[14px] font-semibold dark:text-[#CDEEDB]">
                          Shipping Walkerpack (Northampton)
                        </h1>
                      </div>
                    </div>
                  </>
                }
                footer={
                  <>
                    <div className="flex flex-col ">
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 pt-3 pb-3 tezt-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Email
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            example@mail.com
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Contact
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            +1 234 567 890
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pl-4 pb-4">
                        <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                          Website
                        </h2>
                        <h1 className="text-[#007AFF] dark:text-[#1A88FF] text-[14px] font-medium">
                          www.shippingwalkerpack.com
                        </h1>
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            {/* Row 3: Codes */}
            <div>
              <FlexibleCard
                cardClass="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass="w-full"
                footerClass=""
                header={
                  <>
                    <div className="pt-4 pr-4 pl-4 pb-2">
                      <h1 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-semibold whitespace-nowrap">
                        Codes
                      </h1>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            HS Code
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            5996071650983
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Unit Bar Code
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            5996071650983
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Display Bar Code
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            5996071650983
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Carton Bar Code
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            5996071650983
                          </h1>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>

          {/* ---------- RIGHT SECTION (wider) ---------- */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Row 1: Product Info & Customer Info (two tiles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FlexibleCard
                cardClass="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass="w-full"
                footerClass=""
                header={
                  <>
                    <div className="pt-4 pr-4 pl-4 pb-2">
                      <h1 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-semibold whitespace-nowrap">
                        Product Info
                      </h1>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Name
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            Product A
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Article Number
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            SKU 23434
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Category
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            Electric
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Shelf Life(Month)
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            12
                          </h1>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />

              <FlexibleCard
                cardClass="flex flex-col h-[150px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass="w-full"
                footerClass=""
                header={
                  <>
                    <div className="pt-4 pr-4 pl-4 pb-2">
                      <h1 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-semibold whitespace-nowrap">
                        Customer Info
                      </h1>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Name
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            John Doe
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Contact
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            +1 234 567 890
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Address
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            123, Main Street, NY, Noida, India
                          </h1>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            {/* Row 2: AI Powered Suggestions (full width) */}
            <FlexibleCard
              cardClass="flex flex-col bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass=""
              centerClass="px-4 flex flex-col items-center w-full"
              footerClass=""
              header={
                <>
                  <div className="flex flex-row pl-4 pr-4 pt-4 pb-2 justify-between">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <Icon
                        icon="mingcute:ai-line"
                        width="20"
                        height="20"
                        className=" text-[#09BF64]"
                      />
                      <h1 className="text-[14px] text-[#6F7C74] dark:text-[#EBF9F0] font-medium">
                        AI Powered Suggestions
                      </h1>
                    </div>
                  </div>
                </>
              }
              center={
                <>
                  <div className="h-[265px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 pb-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                    <div className="flex flex-col gap-4 w-full">
                      {AISuggestion.map((msg) => (
                        <FlexibleCard
                          key={msg.id}
                          cardClass="w-full h-auto bg-[#EFFBF380] dark:bg-[#14141480] border-none rounded-xl p-4"
                          headerClass=""
                          centerClass=""
                          footerClass="flex flex-row items-center"
                          header={
                            <div className="relative flex w-full items-center">
                              <div className="flex flex-col gap-3 text-left">
                                <h3 className="text-[13px] text-[#6F7C74] dark:text-[#A9C2B3]">
                                  {msg.title}
                                </h3>
                                <h3 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-medium">
                                  {msg.msg}
                                </h3>
                              </div>
                            </div>
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              }
            />

            {/* Row 3: Other Product Details (full width) */}
            <div>
              <FlexibleCard
                cardClass="flex flex-col h-[200px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                headerClass="w-full"
                centerClass="w-full"
                footerClass=""
                header={
                  <>
                    <div className="pt-4 pr-4 pl-4 pb-2">
                      <h1 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-semibold whitespace-nowrap">
                        Other Product Details
                      </h1>
                    </div>
                  </>
                }
                center={
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-3 w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Unit Display
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            20
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Display/Carton
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            23
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Carton/Layer
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            7
                          </h1>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Layer Pallet
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            6
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Carton/Pallet
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            12
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Unit/Weight
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            50
                          </h1>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 w-full pl-4 pr-4 text-left">
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Units/Pallet
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            20
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Pallet Height
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            10
                          </h1>
                        </div>
                        <div className="flex flex-col gap-1 col-span-1">
                          <h2 className="dark:text-[#D4D4D4] text-[#B0B0B0] text-[10px]">
                            Blue Pallet Height
                          </h2>
                          <h1 className="text-[#2B2B2BCC] dark:text-[#EFFBF3] text-[14px] font-medium">
                            60
                          </h1>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>

        <div className="pb-5"></div>
      </div>
    </>
  );
}
