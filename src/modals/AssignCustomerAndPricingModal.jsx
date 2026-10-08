import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  FieldComponent,
  AddProductModal,
  MultiSelectDropdown,
  LogisticDetailsModal,
} from "@/common/imports";
import { isLastDayOfMonth } from "date-fns";

export default function AssignCustomerAndPricingModal({ closeModal }) {
  const { openModal, closeModal: closeAssignCustomerAndPricingModal } =
    useModal();

  const [actualPrice, setActualPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(AddProductModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(LogisticDetailsModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <Skeleton width="220px" height="28px" className="dark:bg-[#2C2C2CAA]" />

        {/* Fields Container Skeleton */}
        <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* Row 1: MultiSelect Skeleton */}
          <div className="flex gap-4 mb-2 w-full">
            <Skeleton
              width="100%"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Row 2: Radio Buttons Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-row gap-6">
              <Skeleton
                width="120px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="120px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Row 3: Input Fields Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="100%"
                height="40px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="100%"
                height="40px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Row 4: Buttons Skeleton */}
          <div className="flex flex-row gap-4 mb-2 pl-1">
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}

      <div className=" text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">
        Assign Customer & Pricing
      </div>

      {/* fields - row 1*/}
      <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="flex gap-4 mb-2 w-full">
          <MultiSelectDropdown />
        </div>

        {/* fields - row 2*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4 pl-1">
          <div className="flex flex-row gap-6">
            <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
              <input
                type="radio"
                name="product"
                value="pallet"
                className="mr-2 accent-[#0088D1]"
              />
              Normal Product
            </label>
            <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
              <input
                type="radio"
                name="product"
                value="cartons"
                className="mr-2 accent-[#0088D1]"
                defaultChecked
              />
              Promo Product
            </label>
          </div>
        </div>

        {/* fields - row 3*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Actual Price"
              name="actualPrice"
              placeholder="Original price"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Promo Price"
              name="promoPrice"
              placeholder="Discount price"
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
        </div>

        {/* button */}
        <div className="flex flex-row gap-4 mb-2 pl-1">
          <div className="w-full gap-1">
            <ActionButton
              label="Back"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
              onClick={handleBack}
            />
          </div>
          <div className="w-full gap-1">
            <ActionButton
              label="Next"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
