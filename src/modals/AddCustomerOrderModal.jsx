import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  InputTextarea,
  useEffect,
  useState,
  OrderSummaryModal,
  Dropdown,
  FieldComponent,
  clsx,
  PODetailsModal,
} from "@/common/imports";

export default function AddCustomerOrderModal({ closeModal }) {
  const { openModal, closeModal: closeAddCustomerOrderModal } = useModal();

  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [paymentTerm, setPaymentTerm] = useState(null);
  const [bankTransfer, setBankTransfer] = useState(null);
  const [address, setAddress] = useState("");

  const paymentTermOptions = ["7 Days", "1 Month", "3 Month"];
  const bankTransferOptions = ["Metro", "Sadapay", "Meezan"];

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(OrderSummaryModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleContinue = () => {
    closeModal();
    setTimeout(() => {
      openModal(PODetailsModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <div className="flex flex-row gap-2 items-center">
          <Skeleton
            shape="circle"
            width="28px"
            height="28px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="160px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Search Label */}
        <div className="flex flex-row justify-between items-end">
          <Skeleton
            width="120px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Search Input */}
        <div className="relative flex flex-row items-center justify-between w-full">
          <Skeleton
            width="100%"
            height="40px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="flex flex-col w-full pr-3 max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* Fields - Row 1 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="120px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Fields - Row 2 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="120px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="90px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Fields - Row 3 */}
          <div className="flex flex-col lg:flex-row gap-4 pb-2 w-full">
            <div className="flex flex-col gap-2 pl-1 w-full">
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col gap-2 pl-1 w-full">
              <Skeleton
                width="110px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Row 4 - Address */}
          <div className="flex flex-col gap-1 mb-4 pl-1">
            <Skeleton
              width="80px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="70px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Row 5 - Notes */}
          <div className="bg-[#0088D10F] rounded-lg mb-2 pl-1">
            <div className="flex flex-col gap-2 p-2">
              <Skeleton
                width="80px"
                height="14px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 mb-4 flex flex-row gap-4">
            <Skeleton
              width="100%"
              height="50px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="50px"
              borderRadius="8px"
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
      <div className="flex flex-row gap-2">
        <button onClick={handleBack} className="p-1">
          <Icon
            icon="fe:arrow-left"
            width="18px"
            height="18px"
            className="text-[#0B1B33] dark:text-[#EEF8FD]"
          />
        </button>
        <div className=" text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">
          Add Customer
        </div>
      </div>

      {/* search bar */}
      <div className="flex flex-row justify-between items-end">
        <label className="text-[12px] font-normal text-[#6E7A86] dark:text-[#6E7A86]">
          Search Customer
        </label>
      </div>
      <div className="relative flex flex-row items-center justify-between w-full">
        <input
          className="dark:bg-[#0D0D0D] w-full border border-[#0088D1] rounded-lg py-2 pl-3 focus:outline-none focus:ring-1 focus:ring-[#0088D1] text-[14px] text-[#6E7A86] dark:text-[#6E7A86] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
        <Icon
          icon="mdi:magnify"
          className="absolute top-3 right-3 text-[#0088D1] text-lg"
        />
      </div>

      {/* fields - row 1*/}
      <div className="flex flex-col w-full pr-3 max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Name"
              name="customerName"
              placeholder="Enter customer full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="number"
              label="Email Address"
              name="emailAddress"
              placeholder="Email or mobile number"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
        </div>

        {/* row 2 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Mobile Number"
              name="mobileNumber"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="number"
              label="Post Code"
              name="postCode"
              placeholder="Enter Post Code"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            />
          </div>
        </div>

        {/* row 3 */}
        <div className="flex flex-col lg:flex-row gap-4 pb-2 w-full">
          <div className="flex flex-col gap-2 pl-1 w-full">
            <label
              htmlFor="paymentTerm"
              className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            >
              Payment Term
            </label>
            <Dropdown
              inputId="paymentTerm"
              value={paymentTerm}
              options={paymentTermOptions}
              onChange={(e) => setPaymentTerm(e.value)}
              placeholder="Select"
              className={clsx(
                "text-[14px] dark:!text-[#A9BACB] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
              )}
              pt={{
                panel: {
                  className:
                    "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
                },
              }}
            />
          </div>

          <div className="flex flex-col gap-2 pl-1 w-full">
            <label
              htmlFor="bankTransfer"
              className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
            >
              Bank Transfer
            </label>
            <Dropdown
              inputId="bankTransfer"
              value={bankTransfer}
              options={bankTransferOptions}
              onChange={(e) => setBankTransfer(e.value)}
              placeholder="Select"
              className={clsx(
                "text-[14px] dark:!text-[#A9BACB] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
              )}
              pt={{
                panel: {
                  className:
                    "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
                },
              }}
            />
          </div>
        </div>

        {/* row-4 */}
        <div className="flex flex-col gap-1 mb-4 pl-1">
          <label
            htmlFor="address"
            className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
          >
            Address
          </label>
          <InputTextarea
            value={address}
            placeholder="Add address"
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            cols={100}
            className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* row 5 */}
        <div className="bg-[#0088D10F] rounded-lg mb-2 pl-1">
          <div className="flex flex-col gap-2 p-2">
            <h2 className="dark:text-[#A9BACB] text-[14px] text-[#6E7A86]">
              Notes
            </h2>
            <p className="text-[#0B1B33] text-[16px] dark:text-[#EEF8FD]">
              Customer Details will be only visible to you, these details will
              not send to the manufacturer.
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="mt-2 mb-2 flex flex-row gap-4">
          <ActionButton
            label="Back"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-black border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={handleBack}
          />
          <ActionButton
            label="Continue"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-[#0D0D0D] focus:outline-none focus:ring-0"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}
