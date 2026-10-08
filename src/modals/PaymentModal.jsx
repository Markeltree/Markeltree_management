import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  useState,
  useEffect,
  Skeleton,
  RecordPaymentModal,
} from "@/common/imports";

export default function PaymentModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closePaymentModal } = useModal();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const recordPayment = () => {
    closeModal(); // Close current modal

    setTimeout(() => {
      openModal(RecordPaymentModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  return (
    <div className="space-y-3">
      {isLoading ? (
        <>
          {/* Skeleton for title */}
          <Skeleton
            width="6rem"
            height="1.5rem"
            className="dark:bg-[#2C2C2CAA]"
          />

          {/* Skeleton for card */}
          <div className="rounded-xl bg-[#EFFBF3AA] dark:bg-[#141414AA] p-6 flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1 w-1/2">
                <Skeleton
                  width="5rem"
                  height="0.75rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="4rem"
                  height="1.25rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2 items-end">
                <Skeleton
                  width="6rem"
                  height="0.75rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="5rem"
                  height="1.25rem"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* Skeleton for buttons */}
            <div className="flex flex-col gap-2 w-full mt-6">
              <Skeleton
                height="2.625rem"
                className="w-full rounded-md dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="2.625rem"
                className="w-full rounded-m dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[18px] text-[#0F2418] dark:text-[#B5E6C9] font-bold">
            Payment
          </h1>

          <div className="rounded-xl bg-[#EFFBF3AA] dark:bg-[#141414AA] p-6 flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col text-left gap-1">
                <p className="text-[#0E1A12] dark:text-[#CDEEDB] text-[10px] lg:text-[15px]">
                  Amount Paid
                </p>
                <p className="font-semibold text-[14px] lg:text-[20px] dark:text-[#CDEEDB] text-[#0E1A12]">
                  $0.00
                </p>
              </div>
              <div className="flex flex-col justify-between text-right gap-1">
                <p className="text-[#0E1A12] dark:text-[#CDEEDB] text-[10px] lg:text-[15px]">
                  Amount Outstanind
                </p>
                <p className="font-semibold text-[14px] lg:text-[20px] dark:text-[#CDEEDB] text-[#0E1A12]">
                  $6,000.00
                </p>
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-col gap-2 w-full mt-6">
              <ActionButton
                label="Record Payment"
                labelClass="font-normal text-[12px] md:text-[16px]"
                buttonClass="flex items-center justify-center gap-1 text-sm h-[42px] w-full px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-[#0D0D0D] focus:outline-none focus:ring-0"
                onClick={recordPayment}
              />
              <ActionButton
                label="Turn on Card Payment"
                labelClass="font-normal text-[12px] md:text-[16px]"
                buttonClass="flex items-center justify-center gap-1 text-sm h-[42px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                // onClick={closeModal}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
