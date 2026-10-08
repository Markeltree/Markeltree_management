import { useModal } from "@/context/ModalContext";
import {
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  useState,
  AddNewOrderModal,
  ShippingModal,
} from "@/common/imports";

const products = [
  {
    id: "050108",
    name: "Product A",
    image: "/productA.png",
    inStock: true,
    quantity: 50,
    pallets: 1,
    cartons: 50,
  },
  {
    id: "050109",
    name: "Product A",
    image: "/productA.png",
    inStock: true,
    quantity: 50,
    pallets: 1,
    cartons: 50,
  },
  {
    id: "050107",
    name: "Product A",
    image: "/productA.png",
    inStock: true,
    quantity: 50,
    pallets: 1,
    cartons: 50,
  },
  {
    id: "050106",
    name: "Product A",
    image: "/productA.png",
    inStock: true,
    quantity: 50,
    pallets: 1,
    cartons: 50,
  },
];

export default function ProductDisplay({ closeModal }) {
  const { openModal, closeModal: closeProductDisplayModal } = useModal();

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
      openModal(AddNewOrderModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  const handleContinue = () => {
    closeModal();
    setTimeout(() => {
      openModal(ShippingModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header Skeleton */}
        <Skeleton width="200px" height="24px" className="dark:bg-[#2C2C2CAA]" />

        {/* Table Headers */}
        <div className="overflow-auto max-h-[40vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] px-4 pt-3 pb-2 bg-[#EFFBF3] dark:bg-[#141414] rounded-lg">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  width="80%"
                  height="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>

            {/* Skeleton Product Rows */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-dashed border-[#A9C2B3] dark:border-[#A9C2B3]"
              >
                <div className="flex flex-col gap-2 items-start">
                  <Skeleton
                    width="84px"
                    height="60px"
                    className="rounded dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="120px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Skeleton
                    width="80px"
                    height="32px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <Skeleton
                  width="30px"
                  height="16px"
                  className="mx-auto dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="30px"
                  height="16px"
                  className="mx-auto dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="30px"
                  height="16px"
                  className="mx-auto dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="30px"
                  height="20px"
                  className="mx-auto dark:bg-[#2C2C2CAA]"
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
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Summary Footer Skeleton */}
        <div className="space-y-2">
          <Skeleton
            width="100%"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Continue Button Skeleton */}
        <div className="mt-2">
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
          Product Display
        </div>
      </div>

      {/* Table Headers */}
      <div className="overflow-auto max-h-[40vh] px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-[14px] font-normal text-[#0E1A12] dark:text-[#CDEEDB] px-4 pt-3 pb-2 bg-[#EFFBF3] dark:bg-[#141414] rounded-lg">
            <div className="text-left">Product</div>
            <div className="text-center">Quantity(Carton)</div>
            <div className="text-center">Pallet</div>
            <div className="text-center">Catons</div>
            <div className="text-center">Availability</div>
            <div className="text-center">Remove</div>
          </div>

          {/* Product Rows */}

          {products.map((product, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 border-b border-dashed border-[#A9C2B3] dark:border-[#A9C2B3] text-sm"
            >
              {/* Product Info */}
              <div className="flex flex-col gap-2 items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[84px] h-[60px] rounded object-cover"
                />
                <div className="flex flex-row gap-1 whitespace-nowrap">
                  <div className="font-semibold text-[12px] text-[#0E1A12] dark:text-[#CDEEDB]">
                    {product.name}
                  </div>
                  <div className="font-semibold text-[12px] text-[#0E1A12] dark:text-[#CDEEDB]">
                    ({product.id})
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-center">
                <div className="flex items-center border border-[#09BF64] rounded px-2 py-1 gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="p-1"
                  >
                    <Icon
                      icon="mdi:minus"
                      width="18px"
                      height="18px"
                      className="text-[#09BF64] bg-[#09BF6414]"
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
                      className="text-[#09BF64] bg-[#09BF6414]"
                    />
                  </button>
                </div>
              </div>

              {/* Pallet */}
              <div className="text-center font-semibold text-[12px] text-[#0E1A12] dark:text-[#CDEEDB]">
                {product.pallets}
              </div>

              {/* Catons */}
              <div className="text-center font-semibold text-[12px] text-[#0E1A12] dark:text-[#CDEEDB]">
                {product.cartons}
              </div>

              {/* Availability */}
              <div className="text-center text-[#0CB91D] font-semibold text-[16px] whitespace-nowrap">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>

              {/* Remove Button */}
              <div className="flex justify-center">
                <button>
                  <Icon
                    icon="mdi:trash-can-outline"
                    width="16"
                    height="16"
                    className="text-[#0E1A12] dark:text-[#CDEEDB]"
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
          buttonClass="flex items-center justify-center gap-1 text-[12px] h-[34px] px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
          //   onClick={goBackToGenerate}
        />
      </div>

      {/* Summary Footer */}
      <div className="bg-[#EFFBF3] dark:bg-[#2C2C2C66] p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-[#6F7C74] text-[16px] dark:text-[#6F7C74]">
            Quantity
          </span>
          <span className="text-[#0F2418] text-[16px] dark:text-[#B5E6C9]">
            50 Carots
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6F7C74] text-[16px] dark:text-[#6F7C74]">
            Pallet
          </span>
          <span className="text-[#0F2418] text-[16px] dark:text-[#B5E6C9]">
            2
          </span>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-2">
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
