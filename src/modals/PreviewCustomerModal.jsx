import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  Skeleton,
  InputTextarea,
  useEffect,
  useState,
  Dropdown,
  FieldComponent,
  clsx,
  CustomerAddedModal,
} from "@/common/imports";

export default function PreviewCustomerModal({ closeModal }) {
  const { openModal, closeModal: closeInitiateTransferModal } = useModal();

  const data = {
    customerName: "Shraiy Gupta",
    emailAddress: "shraiy@gmail.com",
    mobileNumber: "+91 3853049453",
    postCode: "L24/MK42",
    paymentTerm: "7 Days",
    bankTransfer: "Metro",
    address: "Uttar Pradesh, India",
  };

  const [customerName, setCustomerName] = useState(data.customerName);
  const [emailAdress, setEmailAdress] = useState(data.emailAddress);
  const [mobileNumber, setMobileNumber] = useState(data.mobileNumber);
  const [postCode, setPostCode] = useState(data.postCode);
  const [paymentTerm, setPaymentTerm] = useState(data.paymentTerm);
  const [bankTransfer, setBankTransfer] = useState(data.bankTransfer);
  const [address, setAddress] = useState(data.address);

  const paymentTermOptions = ["7 Days", "1 Month", "3 Month"];
  const bankTransferOptions = ["Metro", "Sadapay", "Meezan"];

  const [isLoading, setLoading] = useState(true);

  const handleSave = () => {
    closeModal();
    setTimeout(() => {
      openModal(CustomerAddedModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <div className="flex flex-row gap-2">
          <Skeleton
            width="80px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* row-1 Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 pt-2 pb-2">
          <div className="flex flex-col w-full gap-1">
            <Skeleton
              width="120px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <Skeleton
              width="120px"
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

        {/* row-2 Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 pb-2">
          <div className="flex flex-col w-full gap-1">
            <Skeleton
              width="120px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <Skeleton
              width="120px"
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

        {/* row-3 Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 pb-2 w-full">
          <div className="flex flex-col gap-2 pl-1 w-full">
            <Skeleton
              width="100px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="flex flex-col gap-2 pl-1 w-full">
            <Skeleton
              width="120px"
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

        {/* row-4 Skeleton (textarea) */}
        <div className="flex flex-col gap-1 mb-4 pl-1">
          <Skeleton
            width="80px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="70px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex flex-row gap-4 mb-2 pl-1 pt-2">
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
    );
  }
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-row gap-2">
        <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
          Preview
        </div>
      </div>

      {/* row-1 */}
      <div className="flex flex-col lg:flex-row gap-4 pt-2 pb-2">
        <div className="flex flex-col w-full gap-1">
          <FieldComponent
            type="text"
            label="Customer Name"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1 pl-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <FieldComponent
            type="text"
            label="Email Address"
            name="email"
            value={emailAdress}
            onChange={(e) => setEmailAdress(e.target.value)}
            inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1 pl-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>
      </div>

      {/* row-2 */}
      <div className="flex flex-col lg:flex-row gap-4 pb-2">
        <div className="flex flex-col w-full gap-1">
          <FieldComponent
            type="text"
            label="Mobile Number"
            name="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1 pl-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <FieldComponent
            type="text"
            label="Post Code"
            name="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1 pl-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>
      </div>

      {/* row-3 */}
      <div className="flex flex-col lg:flex-row gap-4 pb-2 w-full">
        <div className="flex flex-col gap-2 pl-1 w-full">
          <label
            htmlFor="paymentTerm"
            className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          >
            Payment Term
          </label>
          <Dropdown
            inputId="paymentTerm"
            value={paymentTerm}
            options={paymentTermOptions}
            onChange={(e) => setPaymentTerm(e.value)}
            className={clsx(
              "text-[14px] dark:!text-[#A9A9CD] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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
            className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          >
            Bank Transfer
          </label>
          <Dropdown
            inputId="bankTransfer"
            value={bankTransfer}
            options={bankTransferOptions}
            onChange={(e) => setBankTransfer(e.value)}
            className={clsx(
              "text-[14px] dark:!text-[#A9A9CD] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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
          className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
        >
          Address
        </label>
        <InputTextarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
          cols={100}
          className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* button */}
      <div className="flex flex-row gap-4 mb-2 pl-1 pt-2">
        <div className="w-full gap-1">
          <ActionButton
            label="Cancel"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
            onClick={closeModal}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Save"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
