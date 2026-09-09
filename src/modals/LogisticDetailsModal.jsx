import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  FieldComponent,
  BarcodesModal,
  Dropdown,
  clsx,
} from "@/common/imports";
import AssignCustomerAndPricingModal from "./AssignCustomerAndPricingModal";

export default function LogisticDetailsModal({ closeModal }) {
  const { openModal, closeModal: closeLogisticDetailsModal } = useModal();

  const [unitDisplay, setUnitDisplay] = useState("");
  const [displayCarton, setDisplayCarton] = useState("");
  const [cartonLayer, setCartonLayer] = useState("");
  const [layerPallet, setLayerPallet] = useState("");
  const [cartonPallet, setCartonPallet] = useState("");
  const [unitPallet, setUnitPallet] = useState("");
  const [HFSSCompliant, setHFSSCompliant] = useState(null);
  const [countryOfOrigin, setCountryOfOrigin] = useState(null);
  const HFSSCompliantOptions = ["Type 1", "Type 2", "Type 3"];
  const countryOfOriginOptions = ["1", "2", "3"];

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(AssignCustomerAndPricingModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(BarcodesModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <Skeleton width="200px" height="28px" className="dark:bg-[#2C2C2CAA]" />

        {/* Fields Container Skeleton */}
        <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* Row 1: Unit/Display & Display/Carton */}
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

          {/* Row 2: Carton/Layer & Layer/Pallet */}
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

          {/* Row 3: Carton/Pallet & Unit/Pallet */}
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

          {/* Row 4: HFSS Compliant & Country of Origins Dropdowns */}
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

      <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
        Logistcs Details
      </div>

      <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        {/* fields - row 1*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Unit/Display"
              name="unitDisplay"
              placeholder=""
              value={unitDisplay}
              onChange={(e) => setUnitDisplay(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Display/Carton"
              name="displayCarton"
              placeholder=""
              value={displayCarton}
              onChange={(e) => setDisplayCarton(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
        </div>

        {/* fields - row 2*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Carton/Layer"
              name="cartonLayer"
              placeholder=""
              value={cartonLayer}
              onChange={(e) => setCartonLayer(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Layer/Pallet"
              name="layerPallet"
              placeholder=""
              value={layerPallet}
              onChange={(e) => setLayerPallet(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
        </div>

        {/* fields - row 3*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Carton/Pallet"
              name="cartonPallet"
              placeholder=""
              value={cartonPallet}
              onChange={(e) => setCartonPallet(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Unit/Pallet"
              name="unitPallet"
              placeholder=""
              value={unitPallet}
              onChange={(e) => setUnitPallet(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            />
          </div>
        </div>

        {/* row 4 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1 pl-1">
            <label
              htmlFor="HFSSCompliant"
              className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            >
              HFSS Compliant
            </label>
            <Dropdown
              inputId="HFSSCompliant"
              value={HFSSCompliant}
              options={HFSSCompliantOptions}
              onChange={(e) => setHFSSCompliant(e.value)}
              placeholder="Select"
              className={clsx(
                "text-[14px] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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
              htmlFor="countryOfOrigin"
              className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            >
              Country of Origins
            </label>
            <Dropdown
              inputId="countryOfOrigin"
              value={countryOfOrigin}
              options={countryOfOriginOptions}
              onChange={(e) => setCountryOfOrigin(e.value)}
              placeholder="Months"
              className={clsx(
                "text-[14px] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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

        {/* button */}
        <div className="flex flex-row gap-4 mb-2 pl-1">
          <div className="w-full gap-1">
            <ActionButton
              label="Back"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
              onClick={handleBack}
            />
          </div>
          <div className="w-full gap-1">
            <ActionButton
              label="Next"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
