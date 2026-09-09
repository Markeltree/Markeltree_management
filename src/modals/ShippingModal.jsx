import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  ProductDisplayModal,
  Dropdown,
  clsx,
  ContactAndAddressModal,
} from "@/common/imports";

const SHIPPING_OPTIONS = [
  {
    id: "walkerpack",
    label: "Shipping Walkerpack (Northampton)",
    available: true,
    icon: "/walkerpackIcon.png",
  },
  {
    id: "greatbear",
    label: "Shipping Great Bear UK",
    available: false,
    icon: "/greatBearUK.png",
  },
  {
    id: "dhl",
    label: "Shipping DHL UK",
    available: false,
    icon: "/DHL.png",
  },
];

const ORDER_PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function ShippingModal({ closeModal }) {
  const { openModal, closeModal: closeShippingModal } = useModal();

  const [isLoading, setLoading] = useState(true);

  const [selectedShipping, setSelectedShipping] = useState("walkerpack");
  const [orderPriority, setOrderPriority] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(ProductDisplayModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(ContactAndAddressModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <div className="flex flex-row gap-2 items-center">
          <Skeleton
            shape="circle"
            width="28px"
            height="28px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Shipping Options Skeleton */}
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg border border-[#A9A9CD] bg-white dark:bg-[#0D0D0D] h-[64px] gap-3"
            >
              <Skeleton
                shape="circle"
                width="20px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="32px"
                height="32px"
                borderRadius="6px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <div className="flex-1 space-y-2">
                <Skeleton
                  width="70%"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="40%"
                  height="10px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          ))}

        {/* Dropdown Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton
            width="100px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="40px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Button Skeleton */}
        <Skeleton
          height="48px"
          width="100%"
          borderRadius="8px"
          className="dark:bg-[#2C2C2CAA]"
        />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-row gap-2">
        <button onClick={handleBack} className="p-1">
          <Icon
            icon="fe:arrow-left"
            width="18px"
            height="18px"
            className="text-[#151D48] dark:text-[#F2F2FE]"
          />
        </button>
        <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
          Shipping
        </div>
      </div>

      {/* Shipping Options */}
      {SHIPPING_OPTIONS.map((option) => (
        <div
          key={option.id}
          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all h-[64px] ${
            selectedShipping === option.id
              ? "border-[#5D5FEF] bg-[#F4F4FF] dark:bg-[#0D0D0D]"
              : "border-[#A9A9CD] bg-white dark:border-[#A9A9CD] dark:bg-[#0D0D0D]"
          }`}
          onClick={() => setSelectedShipping(option.id)}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedShipping === option.id}
            onChange={() => setSelectedShipping(option.id)}
            className="accent-[#5D5FEF] mr-3"
          />
          <img
            src={option.icon}
            alt={option.label}
            className="w-8 h-8 mr-3 object-contain"
          />
          <div className="flex-1">
            <div className="font-medium text-[14px] text-[#131330] dark:text-[#F2F2FE]">
              {option.label}
            </div>
            <div
              className={`text-[10px] ${
                option.available ? "text-[#0CB91D]" : "text-[#EF4444]"
              }`}
            >
              {option.available ? "Available" : "Not Available"}
            </div>
          </div>
        </div>
      ))}
      {/* Priority Dropdown */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="priority"
          className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
        >
          Order Priority
        </label>
        <Dropdown
          inputId="priority"
          value={orderPriority}
          options={ORDER_PRIORITIES}
          onChange={(e) => setOrderPriority(e.value)}
          placeholder="Select Order priority"
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

      {/* Next Button */}
      <ActionButton
        label="Next"
        labelClass="font-normal text-[12px] md:text-[16px]"
        buttonClass="text-[16px] h-[48px] w-full bg-[#5D5FEF] dark:bg-[#7476F1] text-white dark:text-black focus:outline-none focus:ring-0"
        onClick={handleNext}
      />
    </div>
  );
}
