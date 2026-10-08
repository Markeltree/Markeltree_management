import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  ActionButton,
  DateField,
  Skeleton,
  MultiSelectDropdown,
  PODetailsModal,
  ManufacturerOrderCreatedModal,
} from "@/common/imports";

export default function MemberForApprovalModal({ closeModal }) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeMemberForApprovalModal } = useModal();

  const [task, setTask] = useState("");
  const [loadingDate, setLoadingDate] = useState(null);
  const [receivingDate, setReceivingDate] = useState(null);

  const handleSent = () => {
    closeModal();
    setTimeout(() => {
      openModal(ManufacturerOrderCreatedModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(PODetailsModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Heading */}
        <Skeleton width="220px" height="22px" className="dark:bg-[#2C2C2CAA]" />

        {/* MultiSelect Dropdown */}
        <Skeleton width="100%" height="40px" className="dark:bg-[#2C2C2CAA]" />

        {/* Date Fields (side by side) */}
        <div className="flex flex-row w-full gap-4 pl-1">
          <Skeleton
            width="100%"
            height="40px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="40px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Notes Section */}
        <div className="bg-[#09BF640F] rounded-lg mb-4 mt-4 pl-1">
          <div className="flex flex-col gap-2 p-2">
            {/* Notes heading */}
            <Skeleton
              width="80px"
              height="16px"
              className="dark:bg-[#2C2C2CAA]"
            />
            {/* Notes text (2 lines) */}
            <Skeleton
              width="90%"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="70%"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-2 flex flex-row gap-4">
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
      <h1 className="text-[18px] text-[#0F2418] dark:text-[#B5E6C9] font-bold">
        Select members for Approval
      </h1>

      <MultiSelectDropdown label="Approver" />

      <div className="flex flex-row w-full gap-4 pl-1">
        <DateField
          label="Loading Date"
          value={loadingDate}
          onChange={(date) => setLoadingDate(date)} // <-- date is a Date object
        />

        <DateField
          label="Receiving Date"
          value={receivingDate}
          onChange={(date) => setReceivingDate(date)} // <-- date is a Date object
        />
      </div>

      <div className="bg-[#09BF640F] rounded-lg mb-4 mt-4 pl-1">
        <div className="flex flex-col gap-2 p-2">
          <h2 className="dark:text-[#A9C2B3] text-[14px] text-[#6F7C74]">
            Notes
          </h2>
          <p className="text-[#0F2418] text-[16px] dark:text-[#EFFBF3]">
            Order automatically sent to the manufacturer when approver will
            approve this order.
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-row gap-4">
        <ActionButton
          label="Back"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-black border border-[#09BF64] focus:outline-none focus:ring-0"
          onClick={handleBack}
        />
        <ActionButton
          label="Continue"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-[#0D0D0D] focus:outline-none focus:ring-0"
          onClick={handleSent}
        />
      </div>
    </div>
  );
}
