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

const products = [
  {
    image: "/product.png",
    name: "SMARTPHONE",
    description:
      "Google Pixel 6 Pro - 5G Android Phone - Unlocked Smartphone with Advanced Pixel C...",
    articleNo: "SKU3434",
    unitPrice: "$899",
    quantity: "x1 carton",
    shelfLife: "2 Months",
    subTotal: "$899",
  },
  {
    image: "/product.png",
    name: "SMARTPHONE",
    description:
      "Google Pixel 6 Pro - 5G Android Phone - Unlocked Smartphone with Advanced Pixel C...",
    articleNo: "SKU3434",
    unitPrice: "$899",
    quantity: "x1 carton",
    shelfLife: "2 Months",
    subTotal: "$899",
  },
];

export default function OrderDetail() {
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
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          {/* Title */}
          <div className="flex w-full justify-start items-start">
            <Skeleton
              width="200px"
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Buttons Container */}
          <div className="flex flex-row justify-end items-center gap-4 w-full">
            <Skeleton
              width="104px"
              height="45px"
              className="rounded dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="120px"
              height="45px"
              className="rounded dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="175px"
              height="45px"
              className="rounded dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        {/* Card */}
        <div className="p-4 w-full h-full bg-white dark:bg-black rounded-xl">
          {/* Header Buttons */}
          <div className="flex flex-row gap-2 mb-4">
            <Skeleton
              width="130px"
              height="45px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="120px"
              height="45px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="flex flex-col gap-2 col-span-3 lg:col-span-1">
              <Skeleton
                width="100px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="200px"
                height="14px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>

            <div className="flex flex-col gap-2 col-span-3 lg:col-span-1">
              <Skeleton
                width="80px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="150px"
                height="14px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>

            <div className="flex flex-col gap-2 justify-center col-span-3 lg:col-span-1 text-left lg:text-right">
              <Skeleton
                width="120px"
                height="28px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Delivery text */}
          <div className="text-[12px] pt-4">
            <Skeleton
              width="180px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Table */}
          <div className="pt-6">
            <Skeleton
              width="120px"
              height="18px"
              className="mb-2 dark:bg-[#2C2C2CAA]"
            />
            <div className="overflow-x-auto">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-4 py-4 border-b"
                >
                  <Skeleton
                    shape="rectangle"
                    width="56px"
                    height="56px"
                    className="rounded-md dark:bg-[#2C2C2CAA]"
                  />
                  <div className="flex-1">
                    <Skeleton
                      width="120px"
                      height="16px"
                      className="mb-2 dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="200px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <Skeleton
                    width="90px"
                    height="18px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="90px"
                    height="18px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="90px"
                    height="18px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="90px"
                    height="18px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="90px"
                    height="18px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Billing/Shipping/Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-700">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="pt-4 md:pt-0 px-4">
                <Skeleton
                  width="120px"
                  height="18px"
                  className="mb-2 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="100%"
                  height="60px"
                  className="mb-2 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="70%"
                  height="14px"
                  className="mb-2 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60%"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <h1 className="flex w-full  justify-start items-center text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64] whitespace-nowrap">
            <button
              onClick={() => navigate("/order")}
              className="flex items-center text-[#09BF64] dark:text-[#09BF64] hover:underline"
            >
              Order Management
            </button>
            <Icon
              icon="mdi:chevron-right"
              className="mx-1 text-[#09BF64] dark:text-[#09BF64]"
              width="16"
              height="16"
            />
            #9645761
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
              buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[40px] md:h-[45px] w-auto px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
              menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
              iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
            />

            <MenuActionButton
              label="In Transit"
              iconLight={
                <Icon
                  icon="ep:arrow-down-bold"
                  className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                />
              }
              iconDark={
                <Icon
                  icon="ep:arrow-down-bold"
                  className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
                />
              }
              iconPos="left"
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[40px] md:h-[45px] w-auto px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
            />
            <ActionButton
              label="Generate Invoice"
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
              buttonClass="text-[9px] md:text-[12px] rounded-lg flex items-center justify-center gap-2 h-[40px] md:h-[45px] w-auto px-4 bg-[#09BF64] text-white dark:bg-[#09BF64] dark:text-black border border-[#09BF64] focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* card */}
        <div>
          <FlexibleCard
            cardClass="flex flex-col p-4 w-full h-full bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass="pt-4"
            footerClass="pt-8 pr-4 pl-4 pb-4"
            header={
              <>
                <div className="flex flex-row gap-2 mb-4">
                  <ActionButtonColor
                    label="In Transit"
                    labelClass="font-normal md:font-bold"
                    buttonClass="flex items-center rounded-lg justify-center gap-1 text-[12px] h-[45px] w-[130px] px-4 focus:outline-none focus:ring-0 transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]"
                  />
                  <ActionButton
                    label="Paid"
                    labelClass="font-normal md:font-bold"
                    buttonClass="flex items-center rounded-lg justify-center gap-1 text-[12px] bg-[#22C55E26] text-[#22C55E] h-[45px] w-[120px] px-4 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 bg-[#09BF6414] dark:bg-[#81D959] border border-[#09BF64] dark:border-[#81D959] w-full rounded-lg">
                  <div className="flex flex-col gap-2 col-span-3 lg:col-span-1">
                    <p className="text-[16px] md:text-[18px] text-[#0E1A12] dark:text-[#CDEEDB]">
                      #96459761
                    </p>
                    <p className="flex flex-row items-center text-[10px] md:text-[12px] text-[#475156] dark:text-[#FFFFFF] whitespace-nowrap">
                      1 Products
                      <span className="">
                        <Icon icon="ph:dot" />
                      </span>
                      Order Placed in 17 Jan, 2021 at 7:32 PM
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 col-span-3 lg:col-span-1">
                    <p className="text-[16px] md:text-[18px] text-[#0E1A12] dark:text-[#CDEEDB]">
                      Yes
                    </p>
                    <p className="flex flex-row text-[10px] md:text-[12px] text-[#475156] dark:text-[#FFFFFF]">
                      Invoice sent to customer
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 justify-center col-span-3 lg:col-span-1 text-left lg:text-right">
                    <p className="text-[24px] md:text-[28px] text-[#0CB91D] dark:text-[#0DD121]">
                      $1199.00
                    </p>
                  </div>
                </div>
                <div className="text-[12px] pt-4">
                  <p className="text-[#191C1F] dark:text-white">
                    Order expected deliver{" "}
                    <span className="text-[#0E1A12] dark:text-[#CDEEDB]">
                      23 Jan, 2021
                    </span>
                  </p>
                </div>
              </>
            }
            center={
              <>
                <div className="pb-2">
                  <h1 className="text-[#0E1A12] dark:text-white text-[16px] font-medium">
                    Product
                  </h1>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead className="bg-[#E4E7E9] dark:bg-[#181818] text-left text-[12px] font-normal text-[#475156] dark:text-white">
                      <tr>
                        <th className="w-[40%] px-4 py-3">PRODUCTS</th>
                        <th className="px-4 py-3">ARTICLE NUMBER</th>
                        <th className="px-4 py-3">UNIT PRICE</th>
                        <th className="px-4 py-3">QUANTITY</th>
                        <th className="px-4 py-3">SHELF LIFE</th>
                        <th className="px-4 py-3 text-right">SUB-TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {products.map((product, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                        >
                          {/* Col 1: Product Image + Details */}
                          <td className="px-4 py-4 flex items-start gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-md"
                            />
                            <div>
                              <div className="font-semibold text-[12px] text-[#2DA5F3]">
                                {product.name}
                              </div>
                              <div className="text-[12px] text-[#0E1A12] dark:text-white">
                                {product.description}
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Article number */}
                          <td className="px-4 py-4 text-[12px] text-[#0E1A12] dark:text-white">
                            {product.articleNo}
                          </td>

                          {/* Col 3: Unit Price */}
                          <td className="px-4 py-4 text-[12px] text-[#0E1A12] dark:text-white">
                            {product.unitPrice}
                          </td>

                          {/* Col 4: Quantity */}
                          <td className="px-4 py-4 text-[12px] text-[#0E1A12] dark:text-white">
                            {product.quantity}
                          </td>

                          {/* Col 5: Shelf life */}
                          <td className="px-4 py-4 text-[12px] text-[#0E1A12] dark:text-white">
                            {product.shelfLife}
                          </td>

                          {/* Col 6: Sub-total */}
                          <td className="px-4 py-4 text-right font-semibold text-[12px] text-[#0E1A12] dark:text-white">
                            {product.subTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            }
            footer={
              <>
                {/* Billing / Shipping / Notes */}
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 
                divide-y md:divide-y-0 md:divide-x 
                divide-gray-300 dark:divide-gray-700"
                >
                  {/* Billing */}
                  <div className="md:pr-4 md:pl-0 pt-4 md:pt-0">
                    <h3 className="text-[16px] font-medium text-[#0E1A12] dark:text-[#CDEEDB] mb-2">
                      Billing Address
                    </h3>
                    <p className="text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Kevin Gilbert
                      </span>
                      <br />
                      East Tejkut Bazar, Ward No. 04, Road No. 13/3, House No.
                      132/C, Flat No. 50,
                      <br />
                      Dhaka – 1200, Bangladesh
                    </p>

                    {/* Phone number */}
                    <p className="mt-2 text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Phone Number:
                      </span>{" "}
                      +1-202-555-0118
                    </p>

                    {/* Email */}
                    <p className="mt-2 text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Email:
                      </span>{" "}
                      kevin.gilbert@gmail.com
                    </p>
                  </div>

                  {/* Shipping */}
                  <div className="md:px-4 pt-4 md:pt-0">
                    <h3 className="text-[16px] font-medium text-[#0E1A12] dark:text-[#CDEEDB] mb-2">
                      Shipping Address
                    </h3>
                    <p className="text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Kevin Gilbert
                      </span>
                      <br />
                      East Tejturi Bazar, Word No. 04, Road No. 13/x, House no.
                      1320/C, Flat No. 5D,
                      <br />
                      Dhaka – 1200, Bangladesh
                    </p>

                    {/* Phone number */}
                    <p className="mt-2 text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Phone Number:
                      </span>{" "}
                      +1-202-555-0118
                    </p>

                    {/* Email */}
                    <p className="mt-2 text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      <span className="text-[#0E1A12] dark:text-[#CDEEDB] font-medium">
                        Email:
                      </span>{" "}
                      kevin.gilbert@gmail.com
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="md:pl-4 pt-4 md:pt-0">
                    <h3 className="text-[16px] font-medium text-[#0E1A12] dark:text-[#CDEEDB] mb-2">
                      Order Notes
                    </h3>
                    <p className="text-[13px] text-[#5F6C72] dark:text-[#AAAAAA] font-normal">
                      Donec ac vehicula turpis. Aenean sagittis est eu arcu
                      ornare, eget venenatis purus lobortis. Aliquam erat
                      volutpat. Aliquam magna odio.
                    </p>
                  </div>
                </div>
              </>
            }
          />
        </div>
      </div>
      <div className="pb-5"></div>
    </>
  );
}
