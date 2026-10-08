import { useModal } from "@/context/ModalContext";
import {
  useState,
  Icon,
  ActionButton,
  Skeleton,
  useEffect,
  ProductDisplayModal,
} from "@/common/imports";

const mockProducts = [
  {
    id: "050108",
    name: "Product A",
    description: "Milk 5 Ch 6x20",
    inStock: true,
    stockQty: 40,
    added: false,
    image: "/productA.png",
  },
  {
    id: "050109",
    name: "Product B",
    description: "Juice Pack 4x12",
    inStock: false,
    stockQty: 0,
    added: false,
    image: "/productA.png",
  },
  {
    id: "050110",
    name: "Product C",
    description: "Cereal Box 3x10",
    inStock: true,
    stockQty: 40,
    added: false,
    image: "/productA.png",
  },
  {
    id: "050111",
    name: "Product D",
    description: "Cookies Box 2x15",
    inStock: true,
    stockQty: 40,
    added: true,
    image: "/productA.png",
  },
];

export default function MultiProductSelection({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closeAddNewOrderModal } = useModal();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState(
    Object.fromEntries(mockProducts.map((p) => [p.id, 1]))
  );

  const toggleAdd = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, added: !item.added } : item
      )
    );
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleNext = () => {
    closeModal();
    setTimeout(() => {
      openModal(ProductDisplayModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = products.filter((p) => p.added && p.inStock).length;

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton width="60%" height="20px" className="dark:bg-[#2C2C2CAA]" />
        <Skeleton width="40%" height="12px" className="dark:bg-[#2C2C2CAA]" />
        <Skeleton height="36px" className="w-full dark:bg-[#2C2C2CAA]" />
        <Skeleton
          width="160px"
          height="16px"
          className="mt-4 dark:bg-[#2C2C2CAA]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-h-[52vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-[#EFFBF3] dark:bg-[#141414CC] rounded-lg shadow p-4 h-[186px] flex flex-col justify-between"
            >
              <div className="flex justify-between gap-4">
                {/* Left skeleton */}
                <div className="flex flex-col gap-3">
                  <Skeleton
                    shape="circle"
                    size="64px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="100px"
                    height="12px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="80px"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>

                {/* Right skeleton */}
                <div className="flex flex-col justify-between items-end gap-2">
                  <Skeleton
                    width="120px"
                    height="12px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="130px"
                    height="20px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="100px"
                    height="24px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="80px"
                    height="10px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>

              <Skeleton
                height="36px"
                className="w-full mt-4 dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>

        <Skeleton height="40px" className="w-full dark:bg-[#2C2C2CAA]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Fixed Top Bar */}
      <h1 className="text-[20px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
        Multi Product Selection
      </h1>

      <div className="flex flex-row justify-between items-end gap-4">
        <div className="flex whitespace-nowrap">
          <label className="text-[10px] font-normal text-[#6F7C74] dark:text-[#6F7C74]">
            Dropdown Title
          </label>
        </div>
        <div className="flex text-right">
          <span className="text-[10px] text-[#6F7C74] dark:text-[#6F7C74]">
            {selectedCount} selected SKU{selectedCount !== 1 ? "s" : ""} are
            currently in stock
            <span className="pl-1 text-[10px] text-[#0CB91D]">(in stock)</span>
          </span>
        </div>
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

      <div className="text-[16px] text-[#0F2418] dark:text-[#EFFBF3] font-semibold pt-2">
        Products{" "}
        <span className="text-[14px] font-normal text-[#6F7C74] dark:text-[#6F7C74]">
          (Showing {filteredProducts.length} Products)
        </span>
      </div>

      {/* Scrollable Product Cards Section */}
      <div className="flex flex-col w-full max-h-[52vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#EFFBF3] dark:bg-[#141414CC] rounded-lg shadow  p-4 h-[186px] flex flex-col justify-between"
            >
              {/* Top row: left and right sections */}
              <div className="flex  justify-between gap-4">
                {/* Left Section */}
                <div className="flex flex-col gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[84px] h-[60px] object-cover rounded"
                  />
                  <div className="flex flex-col gap-1 justify-center">
                    <div className="text-[12px] font-medium text-[#0F2418] dark:text-[#B5E6C9]">
                      {product.name} ({product.id})
                    </div>
                    <div className="text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      {product.description}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col justify-between items-end text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4] text-right">
                  <div>
                    <span className="font-semibold">
                      {product.stockQty} cartons{" "}
                    </span>
                    <span
                      className={`font-semibold ${
                        product.inStock ? "text-[#0CB91D]" : "text-[#EF4444]"
                      }`}
                    >
                      ({product.inStock ? "In Stock" : "Out of Stock"})
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-right">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`unit-${product.id}`}
                        className="mr-1 accent-[#09BF64]"
                      />
                      Pallet
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`unit-${product.id}`}
                        defaultChecked
                        className="mr-1 accent-[#09BF64]"
                      />
                      Cartons
                    </label>
                  </div>

                  {/* Quantity Counter */}
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

                  <div className="text-xs text-gray-500">
                    1 Pallet: 50 Cartons
                  </div>
                </div>
              </div>

              {/* Bottom row: button */}
              <div className="pt-3">
                <button
                  onClick={() => toggleAdd(product.id)}
                  disabled={!product.inStock}
                  className={`w-full py-2 rounded-md text-[12px] font-medium  transition-all
                    ${
                      !product.inStock
                        ? "bg-[#09BF6466] text-white cursor-not-allowed dark:bg-[#81D95966] dark:text-[#0D0D0D]"
                        : product.added
                        ? "bg-[#EFFBF3] dark:bg-[#141414CC]  border border-[#09BF64] dark:border-[#81D959] text-[#09BF64] dark:text-[#81D959]"
                        : "bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-[#0D0D0D]"
                    }
                `}
                >
                  {product.added ? "Remove from Order" : "Add to Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full gap-1">
        <ActionButton
          label="Next"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[40px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
