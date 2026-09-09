import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  SimpleTabView,
  FieldComponent,
  ActionButton,
  Dropdown,
  DateField,
  clsx,
  Skeleton,
  Upload,
  UploadingFileCard,
  ImageUpload,
  AssignCustomerAndPricingModal,
} from "@/common/imports";

export default function AddProductModal({
  closeModal,
  activeTabIndex: initialTabIndex = 0,
  initialStep = 1,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeAddProductModal } = useModal();

  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTabIndex]);

  const [brand, setBrand] = useState(null);
  const [packSize, setPackSize] = useState(null);
  const [shelfLife, setShelfLife] = useState(null);
  const [Name, setName] = useState("");
  const [articleNumber, setArticleNumber] = useState("");
  const [type, setType] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);

  const brandOptions = ["brand 1", "brand 2", "brand 3"];
  const typeOptions = ["Type 1", "Type 2", "Type 3"];
  const packSizeOptions = ["Type 1", "Type 2", "Type 3"];
  const shelfLifeOptions = ["1", "2", "3"];

  const handleNextClick = () => {
    closeModal();
    setTimeout(() => {
      openModal(AssignCustomerAndPricingModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const renderItem = (item) => {
    if (item.label === "Generate Manually" || item.type === "field") {
      return (
        <div>
          {isLoading ? (
            <>
              <div className="flex flex-col gap-4">
                {/* Image Upload Skeleton */}
                <div className="flex flex-row justify-between items-center mb-1 !p-0">
                  <Skeleton
                    width="150px"
                    height="24px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <div className="flex gap-2">
                    <Skeleton
                      width="80px"
                      height="30px"
                      className="dark:bg-[#2C2C2CAA]"
                      style={{ borderRadius: "0.375rem" }}
                    />
                    <Skeleton
                      width="80px"
                      height="30px"
                      className="dark:bg-[#2C2C2CAA]"
                      style={{ borderRadius: "0.375rem" }}
                    />
                  </div>
                </div>

                {/* Label Skeleton */}
                <Skeleton
                  width="200px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />

                {/* Upload Box Skeleton */}
                <div className="border border-[#73779140] rounded-lg p-4">
                  <div className="border border-dashed border-[#5D5FEF] dark:border-[#7476F1] rounded-lg flex flex-col items-center justify-center py-6">
                    {/* Upload Icon Skeleton */}
                    <Skeleton
                      width="48px"
                      height="48px"
                      className="dark:bg-[#2C2C2CAA] mb-2"
                      style={{ borderRadius: "0.5rem" }}
                    />
                    {/* Instructions Skeleton */}
                    <Skeleton
                      width="220px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>
                {/* <Skeleton
                  className="dark:bg-[#2C2C2CAA]"
                  width="100%"
                  height="150px"
                  style={{ borderRadius: "0.5rem" }}
                /> */}

                {/* Row 1: Name + Brand */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  {/* Name */}
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                  {/* Brand */}
                  <div className="flex flex-col w-full gap-1 pl-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                </div>

                {/* Row 2: Article Number + Type */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 pl-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                </div>

                {/* Row 3: Expiry Date */}
                <div className="flex flex-col w-full gap-1 pl-1">
                  <Skeleton
                    className="dark:bg-[#2C2C2CAA]"
                    width="100%"
                    height="40px"
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>

                {/* Row 4: Pack Size + Shelf Life */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                  <div className="flex flex-col w-full gap-1 pl-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 pl-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="40px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                </div>

                {/* Row 5: Buttons */}
                <div className="flex flex-row gap-4 mb-2 pl-1">
                  <div className="w-full gap-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="50px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                  <div className="w-full gap-1">
                    <Skeleton
                      className="dark:bg-[#2C2C2CAA]"
                      width="100%"
                      height="50px"
                      style={{ borderRadius: "0.5rem" }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <ImageUpload />

              {/* row 1 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Name"
                    name="name"
                    placeholder="Name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="brand"
                    className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  >
                    Brand
                  </label>
                  <Dropdown
                    inputId="brand"
                    value={brand}
                    options={brandOptions}
                    onChange={(e) => setBrand(e.value)}
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
              </div>
              {/* row 2 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Article Number"
                    name="articleNumber"
                    placeholder="e.g., SKU4743"
                    value={articleNumber}
                    onChange={(e) => setArticleNumber(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="type"
                    className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  >
                    Type
                  </label>
                  <Dropdown
                    inputId="type"
                    value={type}
                    options={typeOptions}
                    onChange={(e) => setType(e.value)}
                    placeholder="Select Product Category"
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

              {/* row 3 */}
              <div className="flex flex-col w-full gap-1 pl-1">
                <DateField
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                />
              </div>

              {/* row 4 */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="packSize"
                    className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  >
                    Pack Size
                  </label>
                  <Dropdown
                    inputId="packSize"
                    value={packSize}
                    options={packSizeOptions}
                    onChange={(e) => setPackSize(e.value)}
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
                    htmlFor="shelfLife"
                    className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
                  >
                    Shelf Life
                  </label>
                  <Dropdown
                    inputId="shelfLife"
                    value={shelfLife}
                    options={shelfLifeOptions}
                    onChange={(e) => setShelfLife(e.value)}
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

              {/* row 5 */}
              <div className="flex flex-row gap-4 mb-2 pl-1">
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
                    label="Next"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handleNextClick}
                  />
                </div>
              </div>
            </>
          )}
        </div>
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
                label="Upload Invoice"
                description="PDF, JPG, XLV and CSV formats, up to 50MB"
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
              <div className="flex flex-row gap-4 mb-2 mt-3">
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
                    onClick={handleNextClick}
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
      <div className="flex flex-col w-full max-h-[80vh] overflow-y-auto px-3 mt-4 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <SimpleTabView
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
          tabs={[
            {
              label: "Generate Manually",
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
          tabLabelClass="text-[12px] lg:text-[14px] font-normal text-center w-full -mt-2"
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
