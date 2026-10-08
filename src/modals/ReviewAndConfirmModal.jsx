import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  Logo,
  OrderCreatedModal,
  DateAndTimeModal,
} from "@/common/imports";

export default function ReviewAndConfirmModal({ closeModal }) {
  const { openModal, closeModal: closeReviewAndConfirmModal } = useModal();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(DateAndTimeModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleCreateOrder = () => {
    closeModal();
    setTimeout(() => {
      openModal(OrderCreatedModal, {
        sizeClass: "w-[85%] md:w-[45%]",
        firstButtonLable: "View Delivery note",
        secondButtonLable: "View in Order Management",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-row gap-2 items-center">
          <Skeleton
            width="1.5rem"
            height="1.5rem"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="14rem"
            height="1.5rem"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Skeleton
            width="8rem"
            height="2rem"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Scrollable content */}
        <div className="max-h-[70vh] overflow-y-auto pr-3">
          {/* Table Header */}
          <Skeleton
            width="6rem"
            height="1rem"
            className="dark:bg-[#2C2C2CAA] mb-2"
          />
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[...Array(5)].map((_, idx) => (
              <Skeleton
                key={idx}
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
            ))}
          </div>

          {/* Product Rows */}
          {[...Array(2)].map((_, row) => (
            <div key={row} className="grid grid-cols-5 items-center gap-2 mb-4">
              <Skeleton
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="90%"
                height="1rem"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}

          {/* Delivery Info Cards */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="rounded-lg p-4 space-y-2 border">
                <Skeleton
                  width="6rem"
                  height="1rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <Skeleton
                      width="100%"
                      height="0.75rem"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="75%"
                      height="1rem"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
            {[...Array(2)].map((_, idx) => (
              <Skeleton
                key={idx}
                width="100%"
                height="2.5rem"
                className="dark:bg-[#2C2C2CAA] rounded-lg"
              />
            ))}
          </div>

          {/* Signature Fields */}
          <div className="grid grid-cols-2 gap-12 mt-12">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Skeleton
                  width="100%"
                  height="1px"
                  className="dark:bg-[#2C2C2CAA] mb-2"
                />
                <Skeleton
                  width="6rem"
                  height="0.75rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 space-y-1">
            <Skeleton
              width="10rem"
              height="1rem"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="18rem"
              height="0.75rem"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="16rem"
              height="0.75rem"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between mt-4 gap-2">
            <Skeleton
              width="100%"
              height="3.125rem"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
            <Skeleton
              width="100%"
              height="3.125rem"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* header */}
      <div className="flex flex-row gap-2">
        <button onClick={handleBack} className="p-1">
          <Icon
            icon="fe:arrow-left"
            width="18px"
            height="18px"
            className="text-[#0B1B33] dark:text-[#EEF8FD]"
          />
        </button>
        <div className="text-[14px] lg:text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD] whie">
          Review & Confirm Delivery Note
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center">
        <Logo className="w-[124px] lg:w-[180px] h-[35px] lg:h-[45px] object-contain" />
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        {/* Table Header */}
        <h2 className="text-[#8E8E9C] text-[7px] lg:text-[14px] pb-2 font-semibold">
          Product Details
        </h2>
        <div className="grid grid-cols-5 justify-between text-center bg-[#EEF8FD] dark:bg-[#1C1C1C] text-[5px] lg:text-[12px] font-medium text-[#0C1626] dark:text-[#CDE9F7] px-2 py-2 rounded-lg">
          <div className="text-left">Product Image</div>
          <div>Article Code</div>
          <div className="whitespace-nowrap">Product Description</div>
          <div>Pallet</div>
          <div>Cartons</div>
        </div>

        {/* Product Rows */}
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 justify-between items-center text-[5px] lg:text-[12px] text-[#0C1626] dark:text-[#CDE9F7] px-2 py-2 border-b border-dashed border-[#A9BACB]"
          >
            <div>
              <img
                src="/productA.png"
                alt="Product"
                className="w-[40px] lg:w-[75px] h-[28px] lg:h-[51px] rounded"
              />
            </div>
            <div className="text-center">SKU050108</div>
            <div className="text-center">Milk 5 Ch 6x20</div>
            <div className="text-center">1</div>
            <div className="text-center">50</div>
          </div>
        ))}

        {/* Delivery Info Sections */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Delivery Address */}
          <div className="col-span-1 border border-[#D4D4D4] bg-[#EEF8FD66] dark:bg-[#141414] rounded-lg p-4 space-y-1">
            <h3 className="font-semibold text-[7px] lg:text-[14px] text-[#8E8E9C]">
              Delivery Address
            </h3>
            <p className="text-[#8E8E9C] text-[6px] lg:text-[12px]">
              Name
              <br />
              <span className="font-medium text-[#2B2B2B] dark:text-[#D4D4D4] text-[7px] lg:text-[14px]">
                John
              </span>
            </p>

            <p className="text-[#8E8E9C] text-[6px] lg:text-[12px] pt-1">
              Address
              <br />
              <span className="font-medium text-[#2B2B2B] dark:text-[#D4D4D4] text-[7px] lg:text-[14px]">
                123 Main Street New York, NY 10001 United States
              </span>
            </p>
          </div>

          {/* Delivery Date/Time */}
          <div className="col-span-1 border border-[#D4D4D4] bg-[#EEF8FD66] dark:bg-[#141414] rounded-lg p-4  space-y-1">
            <h3 className="font-semibold text-[7px] lg:text-[14px] text-[#8E8E9C]">
              Delivery Date
            </h3>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-between">
                <span className="text-[#8E8E9C] text-[6px] lg:text-[12px]">
                  Date
                </span>
                <span className="font-medium text-[#2B2B2B] dark:text-[#D4D4D4] text-[7px] lg:text-[14px]">
                  12/01/2025
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-[#8E8E9C] text-[6px] lg:text-[12px]">
                  Time
                </span>
                <span className="font-medium text-[#2B2B2B] dark:text-[#D4D4D4] text-[7px] lg:text-[14px]">
                  10 PM
                </span>
              </div>
            </div>
            <p className="text-[#8E8E9C] text-[6px] lg:text-[12px] pt-1">
              Order Notes
              <br />
              <span className="font-medium text-[#2B2B2B] dark:text-[#D4D4D4] text-[7px] lg:text-[14px]">
                Be carefull while loading and offloading the product.
              </span>
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-row justify-between gap-4 mt-2">
          <div className="flex flex-row items-center gap-2 w-full bg-[#EEF8FD] dark:bg-[#191919] px-4 py-2 text-[7px] lg:text-[14px] rounded-lg text-[#0C1626] dark:text-[#CDE9F7]">
            <img
              src="/walkerpackIcon.png"
              alt="WalkerPack Icon"
              className="w-3 lg:w-6 h-3 lg:h-6"
            />
            <span>Shipping by WalkerPack</span>
          </div>
          <div className="bg-[#EF44440f] px-4 py-2 text-[7px] lg:text-[14px] rounded-lg w-full text-[#0C1626] dark:text-[#CDE9F7]">
            High Priority
          </div>
        </div>

        {/* Quantity & Receiver Details */}
        <div className="grid grid-cols-2 gap-12 text-[6px] lg:text-[10px] mt-12">
          {[
            "Quantity Delivered",
            "Receiver Name",
            "Date",
            "Receiver Signature",
          ].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Row 1: Line */}
              <div className="w-full border-t border-[#A9BACB] mb-1" />

              {/* Row 2: Centered Label */}
              <label className="text-center text-[#8E8E9C] dark:text-[#8E8E9C]">
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-left mt-6">
          <p className="text-[#2B2B2B] dark:text-[#EEF8FD] text-[6px] lg:text-[12px] font-semibold">
            Teamora
          </p>
          <p className="text-[#8E8E9C] dark:text-[#8E8E9C] text-[5px] lg:text-[8px]">
            101 Regents Pavilion, 4, Summerhouse Road Northampton, <br />
            Northampton shire, NN3 6BJ,
            <br />
            United Kingdom{" "}
            <span className="text-[#2B2B2B] dark:text-[#EEF8FD] text-[5px] lg:text-[8px]">
              07935 29802 sales@cfrsales.co.u
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between mt-4 mb-2 gap-4">
          <ActionButton
            label="Back"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={handleBack}
          />

          <ActionButton
            label="Create Order"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
            onClick={handleCreateOrder}
          />
        </div>
      </div>
    </div>
  );
}
