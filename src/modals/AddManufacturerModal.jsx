import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  SimpleTabView,
  FieldComponent,
  ActionButton,
  Dropdown,
  InputTextarea,
  clsx,
  Skeleton,
  Upload,
  UploadingFileCard,
  EditManufacturerModal,
  ManufacturerAddedModal,
} from "@/common/imports";

export default function AddManufacturerModal({
  closeModal,
  activeTabIndex: initialTabIndex = 0,
  initialStep = 1,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeAddProductModal } = useModal();

  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTabIndex]);

  const [manufacturerName, setManufacturerName] = useState("");
  const [emailAdress, setEmailAdress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [paymentTerm, setPaymentTerm] = useState(null);
  const [bankTransfer, setBankTransfer] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [address, setAddress] = useState("");

  const paymentTermOptions = ["7 Days", "1 Month", "3 Month"];
  const bankTransferOptions = ["Metro", "Sadapay", "Meezan"];
  const currencyOptions = ["Euro", "Rupees", "Dollar"];

  const handleSave = () => {
    closeModal();
    setTimeout(() => {
      openModal(ManufacturerAddedModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handlePreview = () => {
    closeModal();
    setTimeout(() => {
      openModal(EditManufacturerModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };
  const renderItem = (item) => {
    if (item.label === "Add Manually" || item.type === "field") {
      return (
        <div>
          {isLoading ? (
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
          ) : (
            <>
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
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
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
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
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
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
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
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
              </div>

              {/* row-3 */}
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

                <div className="flex flex-col gap-2 pl-1 w-full">
                  <label
                    htmlFor="currency"
                    className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
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

              {/* button */}
              <div className="flex flex-row gap-4 mb-2 pl-1 pt-2">
                <div className="w-full gap-1">
                  <ActionButton
                    label="Cancel"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
                    onClick={closeModal}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Save"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handleSave}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (item.type === "file") {
      return (
        <div className="">
          {isLoading ? (
            <div className="">
              {/* Upload button skeleton */}
              <Skeleton
                width="9rem"
                height="15px"
                className="mb-4 dark:bg-[#2C2C2CAA]"
              />
              <div className="flex flex-col mt-4 p-4 border rounded-md items-center gap-2 w-full">
                <Skeleton width="50%" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <Skeleton width="40%" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <Skeleton width="60%" className="mb-2 dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Card 1 */}
              <div className="mt-4 p-4 border rounded-md">
                <Skeleton width="6rem" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <div className="flex justify-between text-xs mb-2">
                  <Skeleton width="5rem" className="dark:bg-[#2C2C2CAA]" />
                  <Skeleton width="4rem" className="dark:bg-[#2C2C2CAA]" />
                </div>
                <Skeleton height="0.5rem" className="dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Card 2 */}
              <div className="mt-4 p-4 border rounded-md">
                <Skeleton width="6rem" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <div className="flex justify-between text-xs mb-2">
                  <Skeleton width="5rem" className="dark:bg-[#2C2C2CAA]" />
                  <Skeleton width="4rem" className="dark:bg-[#2C2C2CAA]" />
                </div>
                <Skeleton height="0.5rem" className="dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <Skeleton
                  width="100%"
                  height="3rem"
                  className="flex-1 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="100%"
                  height="3rem"
                  className="flex-1 dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          ) : (
            <>
              <Upload
                label="Upload Invoice"
                description="PDF, JPG, XLV and CSV formats, up to 50MB"
              />
              <div className="mt-4 w-full">
                <UploadingFileCard
                  fileName="report.pdf"
                  uploadedKB={120}
                  totalKB={300}
                  percentage={40}
                  onCancel={() => console.log("Cancelled")}
                  showProgress={true}
                  statusText="Uploading..."
                  statusIcon="eos-icons:loading"
                  statusClassName="text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4]"
                  topIcon="oui:cross-in-circle-empty"
                />
              </div>
              <div className="mt-4 w-full">
                <UploadingFileCard
                  fileName="report.pdf"
                  uploadedKB={120}
                  totalKB={300}
                  percentage={40}
                  onCancel={() => console.log("Cancelled")}
                  showProgress={false}
                  statusText="Uploaded"
                  statusIcon="teenyicons:tick-circle-outline"
                  statusClassName="text-[10px] text-[#0CB91D] dark:text-[#0DD121]"
                  topIcon="material-symbols-light:delete-outline-rounded"
                />
              </div>
              <div className="flex flex-row gap-4 mb-2 mt-3">
                <div className="w-full gap-1">
                  <ActionButton
                    label="Cancel"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
                    onClick={closeModal}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Preview"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handlePreview}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full">
      <div>
        <h1 className="text-[20px] text-[#0B1B33] dark:text-[#EEF8FD] font-extrabold">
          Add Manufacturer
        </h1>
      </div>
      <div className="flex flex-col w-full max-h-[80vh] overflow-y-auto px-3 mt-4 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <SimpleTabView
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          tabs={[
            {
              label: "Add Manually",
              contentData: [
                {
                  type: "field",
                },
              ],
            },
            {
              label: "Upload file",
              contentData: [
                {
                  type: "file",
                },
              ],
            },
          ]}
          renderItem={renderItem}
          tabLabelClass="text-[12px] lg:text-[14px] font-normal text-center w-full -mt-2"
          activeTabClass="border-b-[2px] border-[#0088D1] text-[#0B1B33] dark:text-[#EEF8FD] font-medium"
          inactiveTabClass="text-[#0B1B33] dark:text-[#EAF6FC]"
          tabHeaderClass="flex w-full border-b border-[#0088D1] mt-2"
          contentContainerClass="mt-4 w-full"
          panelClass=""
        />
      </div>
    </div>
  );
}
