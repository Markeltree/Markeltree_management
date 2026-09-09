import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  SimpleTabView,
  FieldComponent,
  ActionButton,
  Dropdown,
  clsx,
  Skeleton,
  Upload,
  UploadingFileCard,
} from "@/common/imports";

export default function UpdateInventoryModal({
  closeModal,
  activeTabIndex: initialTabIndex = 0,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeUpdateInventoryModal } = useModal();

  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  const [productName, setProductName] = useState("");
  const [updatedType, setUpdatedType] = useState(null);
  const [packageType, setPackageType] = useState("carton");
  const [currentStock, setCurrentStock] = useState("");
  const [updatedQuantity, setuUpdatedQuantity] = useState("");

  const updatedTypeOptions = ["Test 1", "Test 2", "Test 3"];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTabIndex]);

  const renderItem = (item) => {
    if (item.label === "Generate Manually" || item.type === "field") {
      if (isLoading) {
        return (
          <div className="flex flex-col gap-4 mt-4">
            {/* row 1: Product Name Field */}
            <div className="flex flex-col gap-1 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="mb-1 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="40px"
                className="rounded-lg w-full dark:bg-[#2C2C2CAA]"
              />
            </div>

            {/* row 2: Dropdown */}
            <div className="flex flex-col gap-1 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="mb-1 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="40px"
                className="rounded-lg w-full dark:bg-[#2C2C2CAA]"
              />
            </div>

            {/* row 3: Radio buttons */}
            <div className="flex items-center gap-6 pl-1">
              <div className="flex items-center gap-2">
                <Skeleton
                  shape="circle"
                  size="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="50px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton
                  shape="circle"
                  size="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="50px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* row 4: Current Stock + Updated Quantity */}
            <div className="flex flex-col lg:flex-row justify-between w-full gap-3">
              <div className="flex flex-col gap-1 pl-1 w-full">
                <Skeleton
                  width="100px"
                  height="12px"
                  className="mb-1 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="40px"
                  className="rounded-lg w-full dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="flex flex-col gap-1 pl-1 w-full">
                <Skeleton
                  width="120px"
                  height="12px"
                  className="mb-1 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="40px"
                  className="rounded-lg w-full dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-1 mb-2 mt-2 w-full px-1">
              <Skeleton
                height="50px"
                className="w-full rounded-md dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="50px"
                className="w-full rounded-md dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        );
      }
      return (
        <>
          <div className="flex flex-col gap-4">
            {/* row 1 */}
            <FieldComponent
              type="text"
              label="Product Name"
              name="productName"
              placeholder="Search and product"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              inputClass="w-full pr-10 pl-3 h-[40px] rounded-lg border border-[#73779140] dark:border-[#A9A9CD] text-[14px] dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
              rightIcon={
                <Icon
                  icon="ic:baseline-search"
                  className="text-[#5D5FEF] text-[18px]"
                />
              }
            />

            {/* row 2 */}
            <div className="flex flex-col gap-1 pl-1">
              <label
                htmlFor="updateType"
                className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
              >
                Updated Type
              </label>
              <Dropdown
                inputId="updateType"
                value={updatedType}
                options={updatedTypeOptions}
                onChange={(e) => setUpdatedType(e.target.value)}
                placeholder="Select update type"
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

            {/* row 3 */}
            <div className="flex items-center gap-6 pl-1">
              <label className="flex items-center gap-2 text-[14px] text-[#737791] dark:text-[#A9A9CD]">
                <input
                  type="radio"
                  name="packageType"
                  value="pallet"
                  checked={packageType === "pallet"}
                  onChange={() => setPackageType("pallet")}
                  className="accent-[#5D5FEF]"
                />
                Pallet
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#737791] dark:text-[#A9A9CD]">
                <input
                  type="radio"
                  name="packageType"
                  value="carton"
                  checked={packageType === "carton"}
                  onChange={() => setPackageType("carton")}
                  className="accent-[#5D5FEF]"
                />
                Carton
              </label>
            </div>

            {/* row 4 */}
            <div className="flex flex-col lg:flex-row justify-between w-full gap-3">
              <FieldComponent
                type="text"
                label="Current Stock"
                name="currentStock"
                placeholder="50 Cartons"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                disabled={true}
                inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]
                disabled:bg-[#73779126] dark:disabled:bg-[#73779126] disabled:text-[#2B2B2B] disabled:dark:text-[#A9A9CD] disabled:cursor-not-allowed disabled:"
                containerClass="w-full flex flex-col gap-1 pl-1"
                labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
              />

              <FieldComponent
                type="text"
                label="Updated Quantity"
                name="updatedQuantity"
                placeholder="50 Cartons"
                value={updatedQuantity}
                onChange={(e) => setuUpdatedQuantity(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="w-full flex flex-col gap-1 pl-1"
                labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-4 pl-1 mb-2 mt-2">
              <div className="w-full gap-1">
                <ActionButton
                  label="Cancel"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                  onClick={closeModal}
                />
              </div>
              <div className="w-full gap-1">
                <ActionButton
                  label="Save"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
                  //   onClick={handleNextClick}
                />
              </div>
            </div>
          </div>
        </>
      );
    }

    if (item.type === "file") {
      return (
        <div className="">
          {isLoading ? (
            <div className="">
              {/* Upload button skeleton */}
              <Skeleton
                width="9rem"
                height="15px"
                className="mb-4 dark:bg-[#2C2C2CAA]"
              />
              <div className="flex flex-col mt-4 p-4 border rounded-md items-center gap-2 w-full">
                <Skeleton width="50%" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <Skeleton width="40%" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <Skeleton width="60%" className="mb-2 dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Card 1 */}
              <div className="mt-4 p-4 border rounded-md">
                <Skeleton width="6rem" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <div className="flex justify-between text-xs mb-2">
                  <Skeleton width="5rem" className="dark:bg-[#2C2C2CAA]" />
                  <Skeleton width="4rem" className="dark:bg-[#2C2C2CAA]" />
                </div>
                <Skeleton height="0.5rem" className="dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Card 2 */}
              <div className="mt-4 p-4 border rounded-md">
                <Skeleton width="6rem" className="mb-2 dark:bg-[#2C2C2CAA]" />
                <div className="flex justify-between text-xs mb-2">
                  <Skeleton width="5rem" className="dark:bg-[#2C2C2CAA]" />
                  <Skeleton width="4rem" className="dark:bg-[#2C2C2CAA]" />
                </div>
                <Skeleton height="0.5rem" className="dark:bg-[#2C2C2CAA]" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <Skeleton
                  width="100%"
                  height="3rem"
                  className="flex-1 dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="100%"
                  height="3rem"
                  className="flex-1 dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          ) : (
            <>
              <Upload
                label="Upload Stock"
                description="XLX & CSV formats, up to 50MB"
              />
              <div className="mt-4 w-full">
                <UploadingFileCard
                  fileName="report.pdf"
                  uploadedKB={120}
                  totalKB={300}
                  percentage={40}
                  onCancel={() => console.log("Cancelled")}
                  showProgress={true}
                  statusText="Uploading..."
                  statusIcon="eos-icons:loading"
                  statusClassName="text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4]"
                  topIcon="oui:cross-in-circle-empty"
                />
              </div>
              <div className="mt-4 w-full">
                <UploadingFileCard
                  fileName="report.pdf"
                  uploadedKB={120}
                  totalKB={300}
                  percentage={40}
                  onCancel={() => console.log("Cancelled")}
                  showProgress={false}
                  statusText="Uploaded"
                  statusIcon="teenyicons:tick-circle-outline"
                  statusClassName="text-[10px] text-[#0CB91D] dark:text-[#0DD121]"
                  topIcon="material-symbols-light:delete-outline-rounded"
                />
              </div>
              <div className="flex flex-row gap-4 mb-2 mt-4">
                <div className="w-full gap-1">
                  <ActionButton
                    label="Cancel"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                    onClick={closeModal}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Save"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
                    // onClick={PreviewInvoice}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-[18px] text-[#151D48] dark:text-[#F2F2FE] font-bold">
          Update Inventory
        </h1>
      </div>
      <div className="flex flex-col w-full max-h-[80vh] overflow-y-hidden px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <SimpleTabView
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          tabs={[
            {
              label: "Update manually",
              contentData: [
                {
                  type: "field",
                },
              ],
            },
            {
              label: "Upload file",
              contentData: [
                {
                  type: "file",
                },
              ],
            },
          ]}
          renderItem={renderItem}
          tabLabelClass="text-[12px] lg:text-[14px] font-normal text-center w-full"
          activeTabClass="border-b-[2px] border-[#5D5FEF] text-[#151D48] dark:text-[#F2F2FE] font-medium"
          inactiveTabClass="text-[#151D48] dark:text-[#EEF1FF]"
          tabHeaderClass="flex w-full border-b border-[#5D5FEF] mt-2"
          contentContainerClass="mt-4 w-full"
          panelClass=""
        />
      </div>
    </div>
  );
}
