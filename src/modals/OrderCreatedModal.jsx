import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  PreviewInvoiceModal,
  InitiateTransferModal,
} from "@/common/imports";

export default function OrderCreatedModal({
  closeModal,
  topHeading = "Order Created Successfully",
  centerText = "Your request to transfer Product A from warehouse A to warehouse B has been created successfully, you can track it in stock transfer now!",
  firstButtonLable = "",
  secondButtonLable = "",
  firstButtonOnClick = null,
  secondButtonOnClick = null,
  icon = "charm:circle-tick",
  iconClass = "text-[#20BF55]",
}) {
  const { openModal, closeModal: closeOrderCreatedModal } = useModal();

  const [isLoading, setLoading] = useState(true);

  const hasFirst = Boolean(firstButtonLable);
  const hasSecond = Boolean(secondButtonLable);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleFirstButtonClick = () => {
    if (firstButtonOnClick) {
      firstButtonOnClick();
    } else if (
      firstButtonLable.toLowerCase() === "cancel" ||
      firstButtonLable.toLowerCase() === "done"
    ) {
      closeModal();
    } else if (firstButtonLable.toLowerCase() === "request access") {
      closeModal();
      setTimeout(() => {
        openModal(OrderCreatedModal, {
          sizeClass: "w-[85%] md:w-[45%]",
          topHeading: "REQUEST SENT SUCCESSFULLY",
          centerText:
            "Your request for access has been submitted to the administrator. You will be notified once it is approved.",
          firstButtonLable: "Done",
          // secondButtonLable: "Close",
        });
      }, 200);
    } else if (firstButtonLable.toLowerCase() === "create another request") {
      closeModal();
      setTimeout(() => {
        openModal(InitiateTransferModal, {
          sizeClass: "w-[85%] md:w-[60%]",
        });
      }, 200);
    } else {
      console.log("First button clicked");
    }
  };

  const handleSecondButtonClick = () => {
    if (secondButtonOnClick) {
      secondButtonOnClick();
    } else if (
      secondButtonLable.toLowerCase() === "close" ||
      secondButtonLable.toLowerCase() === "done"
    ) {
      closeModal();
    } else if (secondButtonLable.toLowerCase() === "view invoice") {
      openModal(PreviewInvoiceModal, {
        sizeClass: "w-[85%] md:w-[50%]",
        secondButtonLabel: "Download the Invoice",
        firstButtonLabel: "Cancel",
      });
    } else {
      console.log("second button clicked");
    }
  };

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
      <div className=" text-[20px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
        {topHeading}
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <Icon icon={icon} className={`w-[100px] h-[100px] ${iconClass}`} />
        <p className="text-[16px] text-[#6F7C74]">{centerText}</p>
      </div>
      <div className="flex flex-row w-full justify-between mt-4 gap-4">
        {/* First button (render only if label exists) */}
        {hasFirst && (
          <ActionButton
            label={firstButtonLable}
            labelClass="font-normal text-[11px] md:text-[16px] whitespace-nowrap"
            buttonClass={`flex items-center justify-center gap-1 h-[50px] ${
              hasSecond
                ? "w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64]"
                : "w-full px-1 lg:px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none"
            } focus:outline-none focus:ring-0`}
            onClick={handleFirstButtonClick}
          />
        )}

        {/* Second button (render only if label exists) */}
        {hasSecond && (
          <ActionButton
            label={secondButtonLable}
            labelClass="font-normal text-[11px] md:text-[16px] whitespace-nowrap"
            buttonClass="flex items-center justify-center gap-1 w-full h-[50px] px-1 lg:px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
            onClick={handleSecondButtonClick}
          />
        )}
      </div>
    </div>
  );
}
