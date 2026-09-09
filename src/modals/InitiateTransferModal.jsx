import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  InputTextarea,
  useEffect,
  useState,
  Dropdown,
  TimePicker,
  DateField,
  FieldComponent,
  clsx,
  OrderCreatedModal,
} from "@/common/imports";

export default function InitiateTransferModal({ closeModal }) {
  const { openModal, closeModal: closeInitiateTransferModal } = useModal();

  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [transferDate, setTransferDate] = useState(null);
  const [time, setTime] = useState(null);
  const [sourceWarehouse, setSourceWarehouse] = useState(null);
  const [destinationWarehouse, setDestinationWarehouse] = useState(null);
  const [note, setNote] = useState(null);

  const [isLoading, setLoading] = useState(true);

  const sourceWarehouseOptions = ["Source 1", "Source 2", "Source 3"];
  const destinationWarehouseOptions = [
    "Destination 1",
    "Destination 2",
    "Destination 3",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleRequestTransferStock = () => {
    closeModal();
    setTimeout(() => {
      openModal(OrderCreatedModal, {
        sizeClass: "w-[85%] md:w-[50%]",
        topHeading: "Transfer Request Created Successfully",
        centerText:
          "Your request to transfer Product A from warehouse A to warehouse B has been created successfully, you can track it in stock transfer now!",
        firstButtonLable: "Create another request",
        secondButtonLable: "Done",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {" "}
        {/* reduced spacing */}
        {/* Header Skeleton */}
        <div className="flex flex-row gap-2 items-center">
          <Skeleton
            width="200px"
            height="28px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
        {/* Search bar label skeleton */}
        <div className="flex flex-row justify-between items-end">
          <Skeleton
            width="60px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
        {/* Search input skeleton */}
        <div className="relative flex flex-row items-center justify-between w-full">
          <Skeleton
            height="36px" // slightly smaller height
            className="w-full rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>
        {/* fields - row 1 skeleton with scroll */}
        <div className="flex flex-col w-full max-h-[40vh] overflow-y-auto pr-3 space-y-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* Quantity label skeleton */}
          <Skeleton
            width="70px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />

          {/* Radio buttons skeleton */}
          <div className="flex flex-row gap-6">
            <Skeleton
              width="60px"
              height="18px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="70px"
              height="18px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Quantity input skeleton */}
          <Skeleton height="36px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>
        {/* row 2 skeleton */}
        <div className="flex flex-col lg:flex-row gap-3 pt-2 pb-2">
          <Skeleton
            height="14px"
            width="140px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="36px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
          <Skeleton height="36px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>
        {/* row 3 skeleton */}
        <div className="flex flex-col gap-1">
          <Skeleton
            width="120px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="36px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>
        {/* row 4 skeleton */}
        <div className="pt-2 pb-2 flex flex-col gap-1">
          <Skeleton
            width="140px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="36px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>
        {/* row 5 skeleton */}
        <div className="flex flex-col gap-1 mb-4">
          <Skeleton
            width="100px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="56px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>
        {/* Buttons skeleton */}
        <div className="flex flex-row gap-1 mb-2">
          <Skeleton
            height="44px"
            width="100%"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="44px"
            width="100%"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-row gap-2">
        <div className=" text-[20px] font-bold text-[#151D48] dark:text-[#F2F2FE]">
          Initiate Transfer
        </div>
      </div>

      {/* search bar */}
      <div className="flex flex-row justify-between items-end">
        <label className="text-[12px] font-normal text-[#737791] dark:text-[#737791]">
          Product
        </label>
      </div>
      <div className="relative flex flex-row items-center justify-between w-full pl-1">
        <input
          className="dark:bg-[#0D0D0D] w-full border border-[#5D5FEF] rounded-lg py-2 pl-3 focus:outline-none focus:ring-1 focus:ring-[#5D5FEF] text-[14px] text-[#737791] dark:text-[#737791] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
        <Icon
          icon="mdi:magnify"
          className="absolute top-3 right-3 text-[#5D5FEF] text-lg"
        />
      </div>

      {/* fields - row 1*/}
      <div className="flex flex-col w-full max-h-[65vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-medium text-[#737791] dark:text-[#A9A9CD]">
            Quantity
          </span>
          <div className="flex flex-row gap-6 pl-1">
            <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
              <input
                type="radio"
                name="quantity"
                value="pallet"
                className="mr-2 accent-[#5D5FEF]"
                // defaultChecked // uncomment if you want default selection
              />
              Pallet
            </label>
            <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
              <input
                type="radio"
                name="quantity"
                value="cartons"
                className="mr-2 accent-[#5D5FEF]"
                defaultChecked
              />
              Cartons
            </label>
          </div>

          <FieldComponent
            type="text"
            label=""
            name="quantity"
            placeholder="e.g., 200 cartons"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputClass="text-[14px]  pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1 pl-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>

        {/* row-2 */}
        <div className="flex flex-col lg:flex-row gap-4 pt-2 pb-2">
          <div className="flex flex-col w-full gap-1 pl-1">
            <DateField
              label="Select Transfer Date"
              value={transferDate}
              onChange={(date) => setTransferDate(date)}
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="block text-[12px] text-[#737791] dark:text-[#A9A9CD]">
              Transfer time
            </label>
            <TimePicker value={time} onChange={setTime} />
          </div>
        </div>

        {/* row-3 */}
        <div className="flex flex-col gap-2 pl-1">
          <label
            htmlFor="sourceWarehouse"
            className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          >
            Source Warehouse
          </label>
          <Dropdown
            inputId="sourceWarehouse"
            value={sourceWarehouse}
            options={sourceWarehouseOptions}
            onChange={(e) => setSourceWarehouse(e.value)}
            placeholder="Select warehouse"
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

        {/* row-4 */}
        <div className="pt-2 pb-2 pl-1">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="destinationWarehouse"
              className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
            >
              Destination Warehouse
            </label>
            <Dropdown
              inputId="destinationWarehouse"
              value={destinationWarehouse}
              options={destinationWarehouseOptions}
              onChange={(e) => setDestinationWarehouse(e.value)}
              placeholder="Select warehouse"
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
        </div>

        {/* row 5 */}
        <div className="flex flex-col gap-1 mb-4 pl-1">
          <label
            htmlFor="note"
            className="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          >
            Note(Optional)
          </label>
          <InputTextarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            cols={100}
            placeholder="Any special instructions (e.g., temperature-controlled items)"
            className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* button */}
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
              label="Request Stock Transfer"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
              onClick={handleRequestTransferStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
