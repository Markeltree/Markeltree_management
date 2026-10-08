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

  const target = {
    targetAmoun: "Task A",
    targetAchieved: "60%",
    assignedBy: "Manager",
    createDate: "2024-11-24",
    dueDate: "2024-11-24",
    status: "Completed",
    notes: "Reduced 20 units of SKU123",
  };

  return (
    <div className="space-y-3">
      {isLoading ? (
        <>
          <div className="flex flex-col gap-2">
            {/* Title */}
            <Skeleton className="w-[150px] h-[24px] dark:bg-[#2C2C2CAA]" />

            {/* Target Amount */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[100px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[50px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Target Achieved */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[100px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[50px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Assigned By */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[80px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[100px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Created Date */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[100px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[80px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Due Date */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[80px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[80px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Status */}
            <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[60px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-[70px] h-[16px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Notes */}
            <div className="flex flex-col justify-between text-left gap-1 bg-[#EEF8FD66] p-2 rounded-lg">
              <Skeleton className="w-[50px] h-[16px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-full h-[24px] dark:bg-[#2C2C2CAA]" />
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-2 w-full mt-6">
              <Skeleton className="w-full h-[42px] dark:bg-[#2C2C2CAA]" />
              <Skeleton className="w-full h-[42px] dark:bg-[#2C2C2CAA]" />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[18px] text-[#0B1B33] dark:text-[#B5DEF2] font-bold">
            Target Summary
          </h1>

          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Target Amount:
            </p>
            <p className="text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.targetAmoun}
            </p>
          </div>

          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Target Achieved:
            </p>
            <p className=" text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.targetAchieved}
            </p>
          </div>
          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Assigned By:
            </p>
            <p className="text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.assignedBy}
            </p>
          </div>
          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Created Date:
            </p>
            <p className=" text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.createDate}
            </p>
          </div>
          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Due Date:
            </p>
            <p className="text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.dueDate}
            </p>
          </div>
          <div className="flex flex-row justify-between text-left gap-4 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Status
            </p>
            <p
              className={`text-[10px] lg:text-[14px] dark:text-[#CDE9F7] ${
                target.status === "Pending"
                  ? "text-[#DDD427]"
                  : target.status === "Completed"
                  ? "text-[#22C55E]"
                  : "text-[#FF695B]"
              }`}
            >
              {target.status}
            </p>
          </div>
          <div className="flex flex-col justify-between text-left gap-1 bg-[#EEF8FD66] p-2 rounded-lg">
            <p className="text-[#0C1626] dark:text-[#CDE9F7] text-[10px] lg:text-[14px]">
              Notes:
            </p>
            <p className="text-[10px] lg:text-[14px] dark:text-[#CDE9F7] text-[#2B2B2B]">
              {target.notes}
            </p>
          </div>

          {/* buttons */}
          <div className="flex flex-row gap-4 w-full mt-6">
            <ActionButton
              label="Canel"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[42px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#01CEE9] dark:text-black border border-[#0088D1] dark:border-[#01CEE9] focus:outline-none focus:ring-0"
              onClick={closeModal}
            />
            <ActionButton
              label="Mark as Completed"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[42px] w-full px-4 bg-[#0CB91D] text-white dark:bg-[#0CB91D] dark:text-black focus:outline-none focus:ring-0 whitespace-nowrap"
              // onClick={closeModal}
            />
          </div>
        </>
      )}
    </div>
  );
}
