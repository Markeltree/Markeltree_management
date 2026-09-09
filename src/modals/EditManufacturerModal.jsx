import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  InputTextarea,
  useEffect,
  useState,
  Dropdown,
  FieldComponent,
  ManufacturerAddedModal,
  clsx,
} from "@/common/imports";

export default function EditManufacturerModal({ closeModal }) {
  const { openModal, closeModal: closeEditManufacturerModal } = useModal();

  const data = {
    manufacturerName: "Felfoldi Confectionery Ltd.",
    emailAddress: "shraiy@gmail.com",
    mobileNumber: "+91 3853049453",
    contactPerson: "Shraiy Gupta",
    paymentTerm: "7 Days",
    bankTransfer: "Metro",
    currency: "Euro",
    address: "Uttar Pradesh, India",
  };

  const [manufacturerName, setManufacturerName] = useState(
    data.manufacturerName
  );
  const [emailAdress, setEmailAdress] = useState(data.emailAddress);
  const [mobileNumber, setMobileNumber] = useState(data.mobileNumber);
  const [contactPerson, setContactPerson] = useState(data.contactPerson);
  const [paymentTerm, setPaymentTerm] = useState(data.paymentTerm);
  const [bankTransfer, setBankTransfer] = useState(data.bankTransfer);
  const [currency, setCurrency] = useState(data.currency);
  const [address, setAddress] = useState(data.address);

  const paymentTermOptions = ["7 Days", "1 Month", "3 Month"];
  const bankTransferOptions = ["Metro", "Sadapay", "Meezan"];
  const currencyOptions = ["Euro", "Rupees", "Dollar"];

  const [isLoading, setLoading] = useState(true);

  const handleSave = () => {
    closeModal();
    setTimeout(() => {
      openModal(ManufacturerAddedModal, {
        sizeClass: "w-[85%] md:w-[50%]",
        topHeading: "Customer Edited Successfully",
        centerText:
          "The customer has been added to your list. You can now manage their details & track purchases.",
      });
    }, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-4">
          {/* row 1 */}
          <div className="flex flex-col lg:flex-row gap-4 pt-2 pb-2">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* row 2 */}
          <div className="flex flex-col lg:flex-row gap-4 pb-2">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="90px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* row 3 */}
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
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col gap-2 pl-1 w-full">
              <Skeleton
                width="100px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col gap-2 pl-1 w-full">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* row 4 - textarea */}
          <div className="flex flex-col gap-1 mb-4 pl-1">
            <Skeleton
              width="70px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="70px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* buttons */}
          <div className="flex flex-row gap-4 mb-2 pl-1 pt-2">
            <Skeleton
              width="100%"
              height="50px"
              className="rounded dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="50px"
              className="rounded dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-row gap-2">
        <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
          Edit
        </div>
      </div>

      {/* row 1 */}
      <div className="flex flex-col lg:flex-row gap-4 pt-2 pb-2">
        <div className="flex flex-col w-full gap-1">
          <FieldComponent
            type="text"
            label="Manufacturer Name"
            name="manufacturerName"
            placeholder="Enter manufacturer name"
            value={manufacturerName}
            onChange={(e) => setManufacturerName(e.target.value)}
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
            placeholder="Email or mobile number"
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
            placeholder="Enter customer name"
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
            label="Contact Person"
            name="contactPerson"
            placeholder="Contact person name"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
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
            placeholder="Select"
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
            placeholder="Select"
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
            htmlFor="currency"
            className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          >
            Currency
          </label>
          <Dropdown
            inputId="currency"
            value={currency}
            options={currencyOptions}
            onChange={(e) => setCurrency(e.value)}
            placeholder="Select"
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
          placeholder="Add address"
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
