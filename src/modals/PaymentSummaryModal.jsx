import { useModal } from "@/context/ModalContext";
import { ActionButton, useState, useEffect, Skeleton } from "@/common/imports";

export default function PaymentSummaryModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closePaymentSummaryModal } = useModal();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header */}
        <Skeleton
          width="200px"
          height="24px"
          className="dark:bg-[#2C2C2CAA] rounded"
        />

        <div className="rounded-xl bg-[#EEF8FDAA] dark:bg-[#141414AA] p-6 flex flex-col space-y-3">
          {/* Transaction Type */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="120px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Reference ID */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Date */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="60px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="80px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Category */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="70px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="80px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Client/Vendor */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="90px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Amount */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="60px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="80px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Status */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="40px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center w-full">
            <Skeleton
              width="60px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="120px"
              height="25px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-[18px] text-[#0B1B33] dark:text-[#B5DEF2] font-bold">
        Transaction Summary
      </h1>

      <div className="rounded-xl bg-[#EEF8FDAA] dark:bg-[#141414AA] p-6 flex flex-col">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Transaction Type:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              Invoice Payment
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Reference ID:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              TXN-09876
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Date:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              12/01/2025
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Category:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              Sales
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Client/Vendor:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              ABC Corp
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Payment Method:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#D4D4D4] text-[#2B2B2B]">
              Bank Transfer
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Amount:
            </p>
            <p className="font-medium text-[11px] md:text-[14px] dark:text-[#0CB91D] text-[#0CB91D]">
              +$500
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Status:
            </p>
            <p className="font-semibold text-[11px] md:text-[14px] dark:text-[#0CB91D] text-[#0CB91D]">
              Received
            </p>
          </div>

          <div className="flex flex-row justify-between w-full text-left gap-1">
            <p className="text-[#6E7A86] dark:text-[#6E7A86] text-[11px] md:text-[14px] font-normal">
              Action
            </p>
            <ActionButton
              label="Request Refund"
              labelClass="font-normal text-[11px] lg:text[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[25px] w-[120px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black  focus:outline-none focus:ring-0"
            />
          </div>

          {/* button */}
          <div className="flex flex-col md:flex-row gap-4 mb-2">
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
                label="View Associated Invoice"
                labelClass="font-normal text-[12px] md:text-[16px]"
                buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
