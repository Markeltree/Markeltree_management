import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  ManufacturerSelectionModal,
  AddCustomerOrderModal,
} from "@/common/imports";

const products = [
  {
    id: "050108",
    name: "Product A",
    quantity: 50,
    pallets: 1,
    cartons: 50,
    manufacturer: "Felfoldi Confectionery Ltd.",
    price: "€43",
  },
  {
    id: "050102",
    name: "Product A",
    quantity: 50,
    pallets: 1,
    cartons: 50,
    manufacturer: "Felfoldi Confectionery Ltd.",
    price: "€43",
  },
  {
    id: "050105",
    name: "Product A",
    quantity: 50,
    pallets: 1,
    cartons: 50,
    manufacturer: "Felfoldi Confectionery Ltd.",
    price: "€43",
  },
  {
    id: "050106",
    name: "Product A",
    quantity: 50,
    pallets: 1,
    cartons: 50,
    manufacturer: "Felfoldi Confectionery Ltd.",
    price: "€43",
  },
];

export default function OrderSummaryModal({ closeModal }) {
  const { openModal, closeModal: closeOrderSummaryModal } = useModal();

  const [isLoading, setLoading] = useState(true);

  const [quantities, setQuantities] = useState(
    Object.fromEntries(products.map((p) => [p.id, 1]))
  );

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    closeModal();
    setTimeout(() => {
      openModal(ManufacturerSelectionModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(AddCustomerOrderModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <div className="flex flex-row gap-2">
          <Skeleton
            width="180px"
            height="24px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Table Header Skeleton */}
        <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 pt-3 pb-2 bg-[#F2F2FE] dark:bg-[#141414] rounded-lg gap-3">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    width="100%"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                ))}
            </div>

            {/* Product Rows Skeleton */}
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-dashed border-[#A9A9CD] dark:border-[#A9A9CD] gap-3"
                >
                  {/* Product Info */}
                  <div className="flex flex-col gap-2 items-start">
                    <Skeleton
                      width="120px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="80px"
                      height="12px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex justify-center">
                    <Skeleton
                      width="80px"
                      height="28px"
                      borderRadius="6px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>

                  {/* Pallet */}
                  <Skeleton
                    width="40px"
                    height="14px"
                    className="dark:bg-[#2C2C2CAA] justify-self-center"
                  />

                  {/* Cartons */}
                  <Skeleton
                    width="40px"
                    height="14px"
                    className="dark:bg-[#2C2C2CAA] justify-self-center"
                  />

                  {/* Manufacturer */}
                  <Skeleton
                    width="80px"
                    height="14px"
                    className="dark:bg-[#2C2C2CAA] justify-self-center"
                  />

                  {/* Price */}
                  <Skeleton
                    width="50px"
                    height="14px"
                    className="dark:bg-[#2C2C2CAA] justify-self-center"
                  />

                  {/* Remove */}
                  <Skeleton
                    shape="circle"
                    width="20px"
                    height="20px"
                    className="dark:bg-[#2C2C2CAA] justify-self-center"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Add More Products Skeleton */}
        <div className="p-2 px-2">
          <Skeleton
            width="160px"
            height="34px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Summary Footer Skeleton */}
        <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          <div className="bg-[#F2F2FE] dark:bg-[#2C2C2C66] p-4 rounded-lg space-y-3">
            {Array(7)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="flex justify-between">
                  <Skeleton
                    width="140px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="80px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Continue Buttons Skeleton */}
        <div className="mt-2 flex flex-row gap-4">
          <Skeleton
            width="100%"
            height="50px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="50px"
            borderRadius="8px"
            className="dark:bg-[#2C2C2CAA]"
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
          Order Summary
        </div>
      </div>

      {/* Table Headers */}
      <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] text-[14px] font-normal text-[#131330] dark:text-[#CFCFEC] px-4 pt-3 pb-2 bg-[#F2F2FE] dark:bg-[#141414] rounded-lg">
            <div className="text-left">Product</div>
            <div className="text-center">Quantity(Carton)</div>
            <div className="text-center">Pallet</div>
            <div className="text-center">Catons</div>
            <div className="text-center">Manufacturer</div>
            <div className="text-center">Price</div>
            <div className="text-center">Remove</div>
          </div>

          {/* Product Rows */}

          {products.map((product, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-dashed border-[#A9A9CD] dark:border-[#A9A9CD] text-sm"
            >
              {/* Product Info */}
              <div className="flex flex-col gap-2 items-start">
                <div className="flex flex-row gap-1 whitespace-nowrap">
                  <div className="font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                    {product.name}
                  </div>
                  <div className="font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                    ({product.id})
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-center">
                <div className="flex items-center border border-[#5D5FEF] rounded px-2 py-1 gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="p-1"
                  >
                    <Icon
                      icon="mdi:minus"
                      width="18px"
                      height="18px"
                      className="text-[#5D5FEF] bg-[#5D5FEF14]"
                    />
                  </button>
                  <span className="w-4 text-center font-medium">
                    {quantities[product.id]}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="p-1"
                  >
                    <Icon
                      icon="mdi:plus"
                      width="18px"
                      height="18px"
                      className="text-[#5D5FEF] bg-[#5D5FEF14]"
                    />
                  </button>
                </div>
              </div>

              {/* Pallet */}
              <div className="text-center font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                {product.pallets}
              </div>

              {/* Catons */}
              <div className="text-center font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                {product.cartons}
              </div>

              {/* Manufacturer */}
              <div className="text-center font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                {product.manufacturer}
              </div>

              {/* Price */}
              <div className="text-center font-semibold text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                {product.price}
              </div>

              {/* Remove Button */}
              <div className="flex justify-center">
                <button>
                  <Icon
                    icon="mdi:trash-can-outline"
                    width="16"
                    height="16"
                    className="text-[#131330] dark:text-[#CFCFEC]"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add More Products */}
      <div className="p-2 px-2">
        <ActionButton
          label="Add More Products"
          labelClass="font-normal text-[12px]"
          buttonClass="flex items-center justify-center gap-1 text-[12px] h-[34px] px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
        />
      </div>

      {/* Summary Footer */}
      <div className="overflow-auto max-h-[30vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="bg-[#F2F2FE] dark:bg-[#2C2C2C66] p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Quantity
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              50 Carots
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Total Pallets
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              2
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Per Pallet Unit Quantity
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              2
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Total Units
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              2
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Order
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              Promo
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Promo Price
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              €1.00
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Total Price (€)
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              €1.00
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#737791] text-[16px] dark:text-[#737791]">
              Total Price (£)
            </span>
            <span className="text-[#151D48] text-[16px] dark:text-[#B7BFEA]">
              £1.00
            </span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-2 flex flex-row gap-4">
        <ActionButton
          label="Back"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-black border border-[#5D5FEF] focus:outline-none focus:ring-0"
          onClick={handleBack}
        />
        <ActionButton
          label="Next"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 text-[16px] h-[50px] w-full px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-[#0D0D0D] focus:outline-none focus:ring-0"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
