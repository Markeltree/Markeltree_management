import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  UnitInput,
  LogisticDetailsModal,
  Dropdown,
  clsx,
  DimensionsAndWeightModal,
} from "@/common/imports";

export default function BarcodesModal({ closeModal }) {
  const { openModal, closeModal: closeBarcodesModal } = useModal();

  const [unitBarcode, setUnitBarcode] = useState(null);
  const unitBarcodeOptions = ["Type 1", "Type 2", "Type 3"];

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(LogisticDetailsModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(DimensionsAndWeightModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <Skeleton width="150px" height="28px" className="dark:bg-[#2C2C2CAA]" />

        {/* Fields Container Skeleton */}
        <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* Row 1: Length & Unit Barcode */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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

          {/* Row 2: Display Barcode & Carton Barcode */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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

          {/* Row 3: Measuring Code */}
          <div className="flex flex-col gap-4 mb-4">
            <Skeleton
              width="100%"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Buttons Row */}
          <div className="flex flex-row gap-4 mb-2 pl-1">
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
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {/* Header */}

      <div className=" text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">
        Barcodes
      </div>

      {/* <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]"> */}
      {/* fields - row 1*/}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full gap-1 pl-1">
          <UnitInput label="Length" unit="cm" options={["cm", "mm", "inch"]} />
        </div>

        <div className="flex flex-col w-full gap-1 pl-1">
          <label
            htmlFor="unitBarcode"
            className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
          >
            Unit Barcode
          </label>
          <Dropdown
            inputId="unitBarcode"
            value={unitBarcode}
            options={unitBarcodeOptions}
            onChange={(e) => setUnitBarcode(e.value)}
            placeholder="Select"
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

      {/* fields - row 2*/}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full gap-1 pl-1">
          <UnitInput
            label="Display Barcode"
            unit="cm"
            options={["cm", "mm", "inch"]}
          />
        </div>

        <div className="flex flex-col w-full gap-1 pl-1">
          <UnitInput label="Carton Barcode" unit="g" options={["g", "kg"]} />
        </div>
      </div>

      {/* fields - row 3*/}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col w-full gap-1 pl-1">
          <UnitInput
            label="Measuring Code"
            unit="cm"
            options={["cm", "mm", "inch"]}
          />
        </div>
      </div>

      {/* button */}
      <div className="flex flex-row gap-4 mb-2 pl-1">
        <div className="w-full gap-1">
          <ActionButton
            label="Back"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={handleBack}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Next"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
            onClick={handleNext}
          />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
