import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  AddCustomerModal,
} from "@/common/imports";

export default function CustomerAddedModal({
  closeModal,
  topHeading = "Customer Added Successfully",
  centerText = "The customer has been added to your list. You can now manage their details, track purchases, and compare product prices.",
}) {
  const { openModal, closeModal: closeOrderCreatedModal } = useModal();

  const [isLoading, setLoading] = useState(true);

  const AddCustomer = () => {
    openModal(AddCustomerModal, {
      sizeClass: "w-[85%] md:w-[60%]",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-3">
        {/* Title skeleton */}
        <Skeleton
          width="15rem"
          height="1.5rem"
          className="mb-2 dark:bg-[#2C2C2CAA]"
        />

        {/* Icon + text */}
        <div className="flex flex-col gap-2 items-center text-center">
          <Skeleton
            shape="circle"
            size="100px"
            className="mb-2 dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="16rem"
            height="1rem"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="12rem"
            height="1rem"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-row w-full justify-between mt-4 gap-2">
          <Skeleton
            width="90%"
            height="3.125rem"
            className="rounded-md dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="90%"
            height="3.125rem"
            className="rounded-md dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
        {topHeading}
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <Icon
          icon="charm:circle-tick"
          className="w-[100px] h-[100px] text-[#20BF55]"
        />
        <p className="text-[16px] text-[#737791]">{centerText}</p>
      </div>
      <div className="flex flex-row w-full justify-between mt-4 gap-2">
        <ActionButton
          label="Add more"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
          onClick={AddCustomer}
        />

        {/* Second button (render only if label exists) */}
        <ActionButton
          label="Done"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 w-full h-[50px] px-1 lg:px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
          onClick={closeModal}
        />
      </div>
    </div>
  );
}
