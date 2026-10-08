import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  Skeleton,
  useEffect,
  MenuActionButton,
  menuOptions,
  useState,
  MemberForApprovalModal,
  AddCustomerOrderModal,
} from "@/common/imports";

const poDetails = [
  {
    productName: "QM5 Chocolate (12x20)",
    pallets: "3 Yellow",
    perPalletUnitQuantity: 22,
    order: "Promo",
    price: "€43",
    discount: "€43",
    total: 100,
  },
  {
    productName: "QM5 Chocolate (12x20)",
    pallets: "3 Blue",
    perPalletUnitQuantity: 22,
    order: "Promo",
    price: "€43",
    discount: "€43",
    total: 100,
  },
  {
    productName: "QM5 Chocolate (12x20)",
    pallets: "3 Blue",
    perPalletUnitQuantity: 22,
    order: "Normal",
    price: "€43",
    discount: "€43",
    total: 100,
  },
  {
    productName: "5 Strawberry VEGAN",
    pallets: "3 Yellow",
    perPalletUnitQuantity: 22,
    order: "Normal",
    price: "€43",
    discount: "€43",
    total: 100,
  },
  {
    productName: "5 Strawberry VEGAN",
    pallets: "3 Yellow",
    perPalletUnitQuantity: 22,
    order: "Promo",
    price: "€43",
    discount: "€43",
    total: 100,
  },
  {
    productName: "QM5 Chocolate (12x20)",
    pallets: "3 Yellow",
    perPalletUnitQuantity: 22,
    order: "Promo",
    price: "€43",
    discount: "€43",
    total: 100,
  },
];

export default function PODetailsModal({ closeModal }) {
  const { openModal, closeModal: closePODetailsModal } = useModal();
  const exportMenuOptions = menuOptions();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(AddCustomerOrderModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  const handleContinue = () => {
    closeModal();
    setTimeout(() => {
      openModal(MemberForApprovalModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-row justify-between w-full">
          <Skeleton
            width="150px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="80px"
            height="24px"
            className="dark:bg-[#2C2C2CAA] mr-3"
          />
        </div>

        {/* Table Headers */}
        <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 pt-3 pb-2">
              {Array(7)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton
                    key={idx}
                    width="100%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                ))}
            </div>

            {/* Product Rows */}
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-[#A9C2B340]"
                >
                  {Array(7)
                    .fill(0)
                    .map((_, col) => (
                      <Skeleton
                        key={col}
                        width="80%"
                        height="14px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    ))}
                </div>
              ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-[#EFFBF3] dark:bg-[#2C2C2C66] p-4 rounded-lg space-y-2">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <Skeleton
                  width="120px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            ))}
        </div>

        {/* Add More Products */}
        <div className="p-2 px-2">
          <Skeleton
            width="200px"
            height="34px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Continue & Back Buttons */}
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
      {/* Header */}
      <div className="flex flex-row justify-between w-full">
        <div className=" text-[20px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
          PO Details {"  "} #3561
        </div>
        <div className="mr-3">
          <MenuActionButton
            label="Export"
            iconLight="./exportIconLight.png"
            iconDark="./exportIconDark.png"
            iconPos="left"
            menuOptions={exportMenuOptions}
            labelClass="font-normal md:font-bold"
            buttonClass="flex items-center justify-center gap-1 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-3 md:px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
            menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
            iconClass="w-[12px] h-[10px] xs:w-[13px] xs:h-[11px] sm:w-[14px] sm:h-[12px] md:w-[16px] md:h-[14px]"
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] text-[11px] font-normal text-[#33333380] dark:text-[#CDEEDB] px-4 pt-3 pb-2 rounded-lg">
            <div className="text-left">Product Name</div>
            <div className="text-center">Quantity(Carton)</div>
            <div className="text-center">Per Pallet Unit Quantity</div>
            <div className="text-center">Order</div>
            <div className="text-center">Price</div>
            <div className="text-center">Discount</div>
            <div className="text-center">Total</div>
          </div>

          {/* Product Rows */}

          {poDetails.map((product, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-[#A9C2B340] dark:border-[#A9C2B3] text-sm"
            >
              {/* Product Info */}
              <div className="flex flex-col gap-2 items-start">
                <div className="flex flex-row gap-1 whitespace-nowrap">
                  <div className="font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3] truncate">
                    {product.productName}
                  </div>
                </div>
              </div>

              {/* Pallet */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.pallets}
              </div>

              {/* Catons */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.perPalletUnitQuantity}
              </div>

              {/* Manufacturer */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.order}
              </div>

              {/* Price */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.price}
              </div>

              {/* discount */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.discount}
              </div>

              {/* total */}
              <div className="text-center font-medium text-[12px] text-[#666666] dark:text-[#EFFBF3]">
                {product.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-[#EFFBF3] dark:bg-[#2C2C2C66] p-4 rounded-lg space-y-2 mt-2">
        <div className="flex justify-between">
          <span className="text-[#6F7C74] text-[15px] dark:text-[#6F7C74]">
            Total Pallets
          </span>
          <span className="text-[#0F2418] text-[15px] dark:text-[#B5E6C9]">
            23
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6F7C74] text-[15px] dark:text-[#6F7C74]">
            Total Price (€)
          </span>
          <span className="text-[#0F2418] text-[15px] dark:text-[#B5E6C9]">
            €1.00
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#6F7C74] text-[15px] dark:text-[#6F7C74]">
            Total Price (£)
          </span>
          <span className="text-[#0F2418] text-[15px] dark:text-[#B5E6C9]">
            £1.00
          </span>
        </div>
      </div>

      {/* Add More Products */}
      <div className="p-2 px-2">
        <ActionButton
          label="Add More Products to PO"
          labelClass="font-normal text-[12px]"
          buttonClass="flex items-center justify-center gap-1 text-[12px] h-[34px] px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
        />
      </div>

      {/* Continue Button */}
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
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}
