import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  InputTextarea,
  useEffect,
  useState,
  ShippingModal,
  Dropdown,
  FieldComponent,
  clsx,
  DateAndTimeModal,
} from "@/common/imports";

export default function ContactAndAddressModal({ closeModal }) {
  const { openModal, closeModal: closeContactAndAddressModal } = useModal();

  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [emailAddress, setEmailAddress] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [pinCode, setPinCode] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

  const countryOptions = ["Country 1", "Country 2", "Country 3"];
  const cityOptions = ["city 1", "city 2", "city 3"];

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(ShippingModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(DateAndTimeModal, {
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
            size="28px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="150px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex flex-col gap-1 w-full">
          <Skeleton
            width="120px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="40px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Fields Skeleton: replicate rows */}
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Skeleton
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        ))}

        {/* Textarea Skeleton */}
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton
            width="120px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="70px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Button Skeleton */}
        <Skeleton
          height="48px"
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
            className="text-[#0F2418] dark:text-[#EFFBF3]"
          />
        </button>
        <div className=" text-[20px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
          Contact & Address
        </div>
      </div>

      {/* search bar */}
      <div className="flex flex-row justify-between items-end">
        <label className="text-[12px] font-normal text-[#6F7C74] dark:text-[#6F7C74]">
          Search User or Address
        </label>
      </div>
      <div className="relative flex flex-row items-center justify-between w-full">
        <input
          className="dark:bg-[#0D0D0D] w-full border border-[#09BF64] rounded-lg py-2 pl-3 focus:outline-none focus:ring-1 focus:ring-[#09BF64] text-[14px] text-[#6F7C74] dark:text-[#6F7C74] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
        <Icon
          icon="mdi:magnify"
          className="absolute top-3 right-3 text-[#09BF64] text-lg"
        />
      </div>

      {/* fields - row 1*/}
      <div className="flex flex-col w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Name"
              name="customerName"
              placeholder="Enter customer full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="number"
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter customer phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>
        </div>

        {/* fields - row 2*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Email Address"
              name="emailAddress"
              placeholder="Enter email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>
          <div className="flex flex-col w-full gap-1 pl-1">
            <label
              htmlFor="selectCountry"
              className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            >
              Select Country
            </label>
            <Dropdown
              inputId="country"
              value={country}
              options={countryOptions}
              onChange={(e) => setCountry(e.value)}
              placeholder="Select your country"
              className={clsx(
                "text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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

        {/* fields - row 3*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1">
            <FieldComponent
              type="text"
              label="Pin Code"
              name="pinCode"
              placeholder="Your area pin code"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pl-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>
          <div className="flex flex-col w-full gap-1 pl-1">
            <label
              htmlFor="selectCity"
              className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            >
              Select City
            </label>
            <Dropdown
              inputId="city"
              value={city}
              options={cityOptions}
              onChange={(e) => setCity(e.value)}
              placeholder="Select your city"
              className={clsx(
                "text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
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

        {/* fields - row 4 */}
        <div className="flex flex-col gap-1 mb-4 pl-1">
          <label
            htmlFor="shippingAddress"
            className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
          >
            Shipping Address
          </label>
          <InputTextarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={4}
            cols={100}
            placeholder="Enter full address"
            className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Button */}
        <div className="pl-1">
          <ActionButton
            label="Next"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="text-[16px] h-[48px] w-full bg-[#09BF64] dark:bg-[#81D959] text-white dark:text-black focus:outline-none focus:ring-0"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
