import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  useState,
  useEffect,
  Skeleton,
  FieldComponent,
  DateField,
  Dropdown,
  clsx,
} from "@/common/imports";

export default function RecordPaymentModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closeRecordPaymentModal } = useModal();

  const [amountReceived, setAmountReceived] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentDate, setPaymentDate] = useState(null);
  const [paidInto, setPaidInto] = useState(null);
  const [method, setMethod] = useState(null);
  const [reference, setReference] = useState(null);

  const paidIntoOptions = ["Test 1", "Test 2", "Test 3"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3">
      {isLoading ? (
        <>
          {/* Skeleton Heading */}
          <Skeleton
            width="10rem"
            height="1.5rem"
            className="mb-2 dark:bg-[#2C2C2CAA]"
          />

          {/* Skeleton Form */}
          <div className="flex flex-col gap-4">
            {/* Row 1 */}
            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="6rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="4rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="6rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="5rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="4rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="w-full flex flex-col gap-1 pl-1">
                <Skeleton
                  width="7rem"
                  height="0.875rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="2.5rem"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-2 mb-2 pl-1">
              <Skeleton
                height="3.125rem"
                className="w-full dark:bg-[#2C2C2CAA]"
                borderRadius="8px "
              />
              <Skeleton
                height="3.125rem"
                className="w-full dark:bg-[#2C2C2CAA]"
                borderRadius="8px"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[18px] text-[#0F2418] dark:text-[#B5E6C9] font-bold">
            Record Payment
          </h1>
          <div className="flex flex-col gap-4">
            {/* row 1 */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <FieldComponent
                type="number"
                label="Amount Received"
                name="amountReceived"
                placeholder="6,000"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="flex flex-col gap-1 pl-1 w-full"
                labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              />

              <FieldComponent
                type="number"
                label="Discount"
                name="discount"
                placeholder="0.00"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="flex flex-col gap-1 pl-1 w-full"
                labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              />
            </div>

            {/* row 2 */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex flex-col w-full gap-1 pl-1">
                <DateField
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(date) => setPaymentDate(date)}
                />
              </div>
              <div className="flex flex-col w-full gap-1 pl-1">
                <label
                  htmlFor="paidInto"
                  className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                >
                  Paid Into
                </label>
                <Dropdown
                  inputId="paidInto"
                  value={paidInto}
                  options={paidIntoOptions}
                  onChange={(e) => setPaidInto(e.value)}
                  placeholder="Select"
                  className={clsx(
                    "text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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

            {/* row 3 */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <FieldComponent
                type="text"
                label="Method"
                name="method"
                placeholder="Enter a Method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="flex flex-col gap-1 pl-1 w-full"
                labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              />

              <FieldComponent
                type="text"
                label="Reference (Optional)"
                name="reference"
                placeholder=""
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="flex flex-col gap-1 pl-1 w-full"
                labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              />
            </div>

            {/* Button */}
            <div className="flex flex-row gap-4 mb-2 pl-1">
              <div className="w-full gap-1">
                <ActionButton
                  label="Cancel"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                  onClick={closeModal}
                />
              </div>
              <div className="w-full gap-1">
                <ActionButton
                  label="Record $ 6,000"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
