import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  SimpleTabView,
  FieldComponent,
  ActionButton,
  Dropdown,
  DateField,
  InputTextarea,
  clsx,
  Skeleton,
  Upload,
  UploadingFileCard,
} from "@/common/imports";

export default function UploadInvoiceModal({
  closeModal,
  activeTabIndex: initialTabIndex = 0,
  initialStep = 1,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeUploadInvoiceModal } = useModal();

  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTabIndex]);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [VAT, setVAT] = useState("");
  const [paymentDue, setPaymentDue] = useState("");
  const [invoiceTotal, setInvoiceTotal] = useState("");
  const [note, setNote] = useState("");
  const [paymentTerm, setPaymentTerm] = useState(null);
  const [verification, setVerification] = useState(null);
  const [Status, setStatus] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const StatusOptions = ["Paid", "Pending"];
  const paymentTermOptions = ["Term 1", "Term 2", "Term 3"];
  const verificationOptions = ["Verified", "Not Verified"];

  const renderItem = (item) => {
    if (item.label === "Upload Manually" || item.type === "field") {
      return (
        <div>
          {isLoading ? (
            <>
              <div className="flex flex-col">
                {/* row 1 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                </div>

                {/* row 2 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="25%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="25%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                </div>

                {/* row 3 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                </div>

                {/* row 4 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="30%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                </div>

                {/* row 5 */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="25%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      width="25%"
                      height="16px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="100%"
                      height="40px"
                      className="dark:bg-[#2C2C2CAA] mt-1"
                    />
                  </div>
                </div>

                {/* row 6 - Notes */}
                <div className="flex flex-col gap-1 mb-4">
                  <Skeleton
                    width="30%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="100%"
                    height="70px"
                    className="dark:bg-[#2C2C2CAA] mt-1"
                  />
                </div>

                {/* row 7 - buttons */}
                <div className="flex flex-row gap-4 mb-2">
                  <Skeleton
                    width="50%"
                    height="50px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="50%"
                    height="50px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* row 1 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Invoice Number"
                    name="invoiceNumber"
                    placeholder="Invoice Number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Client Name"
                    name="clientName"
                    placeholder="Email or mobile number"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
              </div>

              {/* row 2 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1 pl-1">
                  <DateField
                    label="Invoice Date"
                    value={invoiceDate}
                    onChange={(date) => setInvoiceDate(date)}
                  />
                </div>

                <div className="flex flex-col w-full gap-1 pl-1">
                  <DateField
                    label="Due Date"
                    value={dueDate}
                    onChange={(date) => setDueDate(date)}
                  />
                </div>
              </div>
              {/* row 3 */}

              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1 pl-1">
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
                    placeholder="Select type"
                    className={clsx(
                      "text-[14px] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                    )}
                    pt={{
                      panel: {
                        className:
                          "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Payment Due"
                    name="paymentDue"
                    placeholder="e.g., €43"
                    value={paymentDue}
                    onChange={(e) => setPaymentDue(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
              </div>

              {/* row 4 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="VAT"
                    name="VAT"
                    placeholder="e.g., €43"
                    value={VAT}
                    onChange={(e) => setVAT(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Invoice Total"
                    name="invoiceTotal"
                    placeholder="e.g., €43"
                    value={invoiceTotal}
                    onChange={(e) => setInvoiceTotal(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  />
                </div>
              </div>

              {/* row 5 */}

              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="verification"
                    className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  >
                    Verification
                  </label>
                  <Dropdown
                    inputId="verification"
                    value={verification}
                    options={verificationOptions}
                    onChange={(e) => setVerification(e.value)}
                    placeholder="Select type"
                    className={clsx(
                      "text-[14px] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                    )}
                    pt={{
                      panel: {
                        className:
                          "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="Status"
                    className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                  >
                    Status
                  </label>
                  <Dropdown
                    inputId="Status"
                    value={Status}
                    options={StatusOptions}
                    onChange={(e) => setStatus(e.value)}
                    placeholder="Select type"
                    className={clsx(
                      "text-[14px] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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

              {/* row 6 */}
              <div className="flex flex-col gap-1 mb-4 ">
                <label
                  htmlFor="note"
                  className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
                >
                  Notes
                </label>
                <InputTextarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  cols={100}
                  placeholder="Invoice notes"
                  className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6E7A8640] dark:border-[#A9BACB] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                />
              </div>

              {/* row 7 - buttons */}
              <div className="flex flex-row gap-4 mb-2 pl-1">
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
                    // onClick={handleNextClick}
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
                    label="Save"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
                    // onClick={handleNextClick}
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
      <div className="flex flex-col w-full max-h-[80vh] overflow-y-auto px-3 mt-4 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <SimpleTabView
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          tabs={[
            {
              label: "Upload Manually",
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
