import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  SimpleTabView,
  FieldComponent,
  ActionButton,
  Dropdown,
  InputTextarea,
  DateField,
  clsx,
  Skeleton,
  Upload,
  UploadingFileCard,
  PreviewInvoiceModal,
  PaymentModal,
} from "@/common/imports";

export default function GenerateInvoiceModal({
  closeModal,
  activeTabIndex: initialTabIndex = 0,
  initialStep = 1,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeGeneratedModal } = useModal();

  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeTabIndex]);

  const [customerName, setCustomerName] = useState(null);
  const [customerContact, setCustomerContact] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [product, setProduct] = useState(null);
  const [ledgerAccount, setLedgerAccount] = useState(null);
  const [qtyHrs, setQtyHrs] = useState("");
  const [priceRate, setPriceRate] = useState("");
  const [discount, setDiscount] = useState("");
  const [vatRate, setVATRate] = useState(null);
  const [VAT, setVAT] = useState("");
  const [total, setTotal] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAndCondition, setTermsAndCondition] = useState("");
  const [carriageSelect, setCarriageSelect] = useState("");
  const [carriage, setCarriage] = useState("");

  const [productModalFormData, setProductModalFormData] = useState([]);
  const [step, setStep] = useState(initialStep);

  const custmoerNameOptions = ["Test 1", "Test 2", "Test 3"];
  const productOptions = ["Product 1", "Product 2", "Product 3"];
  const ledgerAccountOptions = ["Test 1", "Test 2", "Test 3"];
  const vatRateOptions = ["Test 1", "Test 2", "Test 3"];
  const carriageSelectOptions = ["Test 1", "Test 2", "Test 3"];

  const handleAddProduct = () => {
    const newProductData = {
      product,
      ledgerAccount,
      qtyHrs,
      priceRate,
      discount,
      vatRate,
      VAT,
      total,
      productDescription,
    };
    setProductModalFormData((prev) => {
      const formData = [...prev, newProductData];
      console.log("Product Form Data:", formData);
      return formData;
    });

    setProduct(null);
    setLedgerAccount(null);
    setQtyHrs("");
    setPriceRate("");
    setDiscount("");
    setVATRate(null);
    setVAT("");
    setTotal("");
    setProductDescription("");
  };

  const handleRemoveClick = () => {
    setProduct(null);
    setLedgerAccount(null);
    setQtyHrs("");
    setPriceRate("");
    setDiscount("");
    setVATRate(null);
    setVAT("");
    setTotal("");
    setProductDescription("");
  };

  const handleNextClick = () => {
    setStep((prev) => {
      const next = prev + 1;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return next;
    });
  };

  const handleBackClick = () => {
    setStep((prev) => {
      const back = prev - 1;
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return back;
    });
  };

  const PreviewInvoice = () => {
    closeModal(); // Close current modal

    setTimeout(() => {
      openModal(PreviewInvoiceModal, {
        sizeClass: "w-[85%] md:w-[50%]",
        fromTabIndex: activeTabIndex,
        restoreStep: activeTabIndex === 0 ? 3 : null,
      });
    }, 200);
  };

  const SendTheInvoice = () => {
    closeModal(); // Close current modal

    setTimeout(() => {
      openModal(PaymentModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  const renderItem = (item) => {
    if (item.label === "Generate Manually" || item.type === "field") {
      if (step === 1) {
        if (isLoading) {
          return (
            <div className="space-y-4 gap-4">
              {/* Skeleton for Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton
                  height="40px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="40px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Skeleton for Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton
                  height="40px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="40px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Skeleton for Row 3 */}
              <Skeleton
                height="40px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {/* Skeleton for Row 4 */}
              <Skeleton
                height="70px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {/* Skeleton for Row 5 */}
              <Skeleton
                height="70px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {/* Skeleton for Row 6 (buttons) */}
              <div className="grid grid-cols-2 gap-2">
                <Skeleton
                  height="50px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="50px"
                  borderRadius="8px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          );
        }
        return (
          <>
            {/* row 1 */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex flex-col w-full gap-1 pl-1">
                <label
                  htmlFor="customerName"
                  className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                >
                  Customer Name
                </label>
                <Dropdown
                  inputId="customerName"
                  value={customerName}
                  options={custmoerNameOptions}
                  onChange={(e) => setCustomerName(e.value)}
                  placeholder="Select type"
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
              <div className="flex flex-col w-full gap-1">
                <FieldComponent
                  type="text"
                  label="Customer Contact"
                  name="customerContact"
                  placeholder="Email or mobile number"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                  containerClass="flex flex-col gap-1 pl-1"
                  labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                />
              </div>
            </div>

            {/* row 2 */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex flex-col w-full gap-1 pl-1">
                <DateField
                  label="Invoice Date"
                  value={invoiceDate}
                  onChange={(date) => setInvoiceDate(date)} // <-- date is a Date object
                />
              </div>
              <div className="flex flex-col w-full gap-1 pl-1">
                <DateField
                  label="Due Date"
                  value={dueDate}
                  onChange={(date) => setDueDate(date)} // <-- date is a Date object
                />
              </div>
            </div>

            {/* row 3 */}
            <div className="w-full gap-4 mb-4">
              <FieldComponent
                type="text"
                label="Reference Number"
                name="referenceNumber"
                placeholder="e.g., Order number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                containerClass="flex flex-col gap-1 pl-1"
                labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              />
            </div>

            {/* row 4 */}
            <div className="flex flex-col gap-1 mb-4 pl-1">
              <label
                htmlFor="invoiceAddress"
                className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              >
                Invoice Address
              </label>
              <InputTextarea
                value={invoiceAddress}
                onChange={(e) => setInvoiceAddress(e.target.value)}
                rows={4}
                cols={100}
                placeholder="Add a main address"
                className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* row 5 */}
            <div className="flex flex-col gap-1 mb-4 pl-1">
              <label
                htmlFor="deliveryAddress"
                className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              >
                Delivery Address
              </label>
              <InputTextarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={4}
                cols={100}
                placeholder="Add a delivery address"
                className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* row 6 */}
            <div className="flex flex-row gap-4 mb-2 pl-1">
              <div className="w-full gap-1">
                <ActionButton
                  label="Cancel"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                  onClick={closeModal}
                />
              </div>
              <div className="w-full gap-1">
                <ActionButton
                  label="Next"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                  onClick={handleNextClick}
                />
              </div>
            </div>
          </>
        );
      } else if (step === 2) {
        if (isLoading) {
          return (
            <div className="bg-[#EFFBF3AA] dark:bg-[#2C2C2C66] p-2 rounded-md">
              {/* Row 1 */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <Skeleton
                  width="100%"
                  height="45px"
                  className="rounded-lg dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="100%"
                  height="45px"
                  className="rounded-lg dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  height="45px"
                  className="col-span-3 lg:col-span-1 rounded-lg dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Row 4 */}
              <div className="mb-6">
                <Skeleton
                  height="45px"
                  className="rounded-lg dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Row 5 (buttons) */}
              <div className="flex justify-between mb-6">
                <Skeleton
                  width="150px"
                  height="35px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="96px"
                  height="35px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
              </div>

              {/* Row 6 (navigation buttons) */}
              <div className="flex gap-2">
                <Skeleton
                  width="100%"
                  height="50px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="100%"
                  height="50px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          );
        }
        return (
          <>
            <div className="bg-[#EFFBF3AA] dark:bg-[#2C2C2C66] p-2 rounded-md items">
              {/* row 1 */}
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="customerName"
                    className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  >
                    Product
                  </label>
                  <Dropdown
                    inputId="product"
                    value={product}
                    options={productOptions}
                    onChange={(e) => setProduct(e.value)}
                    placeholder="Select"
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
                <div className="flex flex-col w-full gap-1 pl-1">
                  <label
                    htmlFor="customerName"
                    className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  >
                    Ledger Account
                  </label>
                  <Dropdown
                    inputId="ledgerAccount"
                    value={ledgerAccount}
                    options={ledgerAccountOptions}
                    onChange={(e) => setLedgerAccount(e.value)}
                    placeholder="Select"
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

              {/* row 2 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <FieldComponent
                    type="text"
                    label="Qty/Hrs"
                    name="qtyHrs"
                    placeholder="e.g., Order number"
                    value={qtyHrs}
                    onChange={(e) => setQtyHrs(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <FieldComponent
                    type="text"
                    label="Price Rate"
                    name="priceRate"
                    placeholder="e.g., Order number"
                    value={priceRate}
                    onChange={(e) => setPriceRate(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <FieldComponent
                    type="text"
                    label="Discount"
                    name="discount"
                    placeholder="e.g., Order number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
              </div>

              {/* row 3 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <div className="flex flex-col gap-1 pl-1">
                    <label
                      htmlFor="vatRate"
                      className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                    >
                      VAT Rate
                    </label>
                    <Dropdown
                      inputId="vatRate"
                      value={vatRate}
                      options={vatRateOptions}
                      onChange={(e) => setVATRate(e.target.value)}
                      placeholder="Select"
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
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <FieldComponent
                    type="text"
                    label="VAT"
                    name="VAT"
                    placeholder="e.g., Order number"
                    value={VAT}
                    onChange={(e) => setVAT(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
                <div className="w-full gap-1 col-span-3 lg:col-span-1">
                  <FieldComponent
                    type="text"
                    label="Total"
                    name="total"
                    placeholder="e.g., Order number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
              </div>

              {/* row 4 */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="w-full gap-1">
                  <FieldComponent
                    type="text"
                    label="Product Description"
                    name="productDescription"
                    placeholder="Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="flex flex-col gap-1 pl-1"
                    labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                  />
                </div>
              </div>

              {/* row 5 */}
              <div className="flex flex-row mb-2 justify-between">
                <div className="gap-1 flex">
                  <ActionButton
                    label="Add another product"
                    labelClass="font-light"
                    buttonClass="flex items-center justify-center gap-1 text-[12px] w-[150px] h-[30px] px-4 bg-[#EFFBF3AA] dark:bg-[#2C2C2C66] text-[#2B2B2BCC]  dark:text-[#D4D4D4CC] border border-[#2B2B2BCC] dark:border-[#D4D4D4CC] focus:outline-none focus:ring-0"
                    onClick={handleAddProduct}
                  />
                </div>
                <div className="gap-1 flex">
                  <ActionButton
                    label="Remove"
                    labelClass="font-light"
                    buttonClass="flex items-center justify-center gap-1 text-[12px] w-[96px] h-[30px] px-4 bg-[#EF4444] text-[#FFFFFF] dark:bg-[#F15B5B] dark:text-[#0D0D0D] border-none focus:outline-none focus:ring-0"
                    onClick={handleRemoveClick}
                  />
                </div>
              </div>
            </div>

            {/* row 6 */}
            <div className="mt-4">
              <div className="flex flex-row gap-4 pl-1 mb-2 mt-2">
                <div className="w-full gap-1">
                  <ActionButton
                    label="Back"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                    onClick={handleBackClick}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Next"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handleNextClick}
                  />
                </div>
              </div>
            </div>
          </>
        );
      } else if (step === 3) {
        if (isLoading) {
          return (
            <>
              {/* row 1 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2 lg:col-span-1 flex flex-col w-full gap-1 pl-1">
                  <Skeleton
                    width="80px"
                    height="16px"
                    className=" dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    height="60px"
                    className="w-full rounded-lg dark:bg-[#2C2C2CAA]"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 flex flex-col w-full gap-1 pl-1">
                  <Skeleton
                    width="120px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    height="60px"
                    className="w-full rounded-lg dark:bg-[#2C2C2CAA]"
                  />
                </div>
              </div>

              {/* row 2 */}
              <div className="bg-[#EFFBF3AA] dark:bg-[#2C2C2C66] p-2 rounded-md">
                <div className="flex flex-col lg:flex-row w-full gap-2 lg:items-center mb-4 pl-1">
                  <Skeleton
                    width="80px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Skeleton
                      height="45px"
                      className="w-full rounded-lg dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      height="45px"
                      className="w-full rounded-lg dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                </div>

                {/* row 3 summary */}
                <div className="flex flex-col gap-4 pl-1">
                  {[...Array(4)].map((_, i) => (
                    <div className="flex flex-row justify-between" key={i}>
                      <Skeleton
                        width="100px"
                        height="16px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                      <Skeleton
                        width="40px"
                        height="16px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* buttons */}
              <div className="mt-4">
                <div className="flex flex-row gap-1 mb-2 mt-2">
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
            </>
          );
        }
        return (
          <>
            {/* row 1 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2 lg:col-span-1 flex flex-col w-full gap-1 pl-1">
                <label
                  htmlFor="notes"
                  className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                >
                  Notes
                </label>
                <InputTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  cols={30}
                  //   placeholder="Add a delivery address"
                  className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                />
              </div>
              <div className="col-span-2 lg:col-span-1 flex flex-col w-full gap-1 pl-1">
                <label
                  htmlFor="termsAndCondition"
                  className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                >
                  Terms & Condition
                </label>
                <InputTextarea
                  value={termsAndCondition}
                  onChange={(e) => setTermsAndCondition(e.target.value)}
                  rows={4}
                  cols={30}
                  //   placeholder="Add a delivery address"
                  className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                />
              </div>
            </div>
            <div className="bg-[#EFFBF3AA] dark:bg-[#2C2C2C66] p-2 rounded-md">
              {/* row 2 */}
              <div className="flex flex-col lg:flex-row w-full gap-2 lg:items-center mb-4 pl-1">
                <label
                  htmlFor="carriage"
                  className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
                >
                  Carriage
                </label>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Dropdown
                    inputId="carriageSelect"
                    value={carriageSelect}
                    options={carriageSelectOptions}
                    onChange={(e) => setCarriageSelect(e.target.value)}
                    placeholder="Select"
                    className={clsx(
                      "col-span-1 w-full text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                    )}
                    pt={{
                      panel: {
                        className:
                          "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
                      },
                    }}
                  />
                  <FieldComponent
                    type="number"
                    name="carriage"
                    placeholder="0.00"
                    value={carriage}
                    onChange={(e) => setCarriage(e.target.value)}
                    inputClass="w-full text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
                    containerClass="col-span-1 flex flex-col w-full"
                  />
                </div>
              </div>

              {/* row 3 */}
              <div className="flex flex-col gap-4 pl-1">
                <div className="flex flex-row justify-between">
                  <p className="text-[#6F7C74] dark:text-[#A9C2B3] text-[14px]">
                    Discount
                  </p>
                  <p className="text-[#2B2B2B] dark:text-[#D4D4D4] text-[14px] font-semibold">
                    0.00
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-[#6F7C74] dark:text-[#A9C2B3] text-[14px]">
                    Net
                  </p>
                  <p className="text-[#2B2B2B] dark:text-[#D4D4D4] text-[14px] font-semibold">
                    0.00
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-[#6F7C74] dark:text-[#A9C2B3] text-[14px]">
                    Vat
                  </p>
                  <p className="text-[#2B2B2B] dark:text-[#D4D4D4] text-[14px] font-semibold">
                    0.00
                  </p>
                </div>

                <div className="flex flex-row justify-between mt-2">
                  <p className="text-[#6F7C74] dark:text-[#A9C2B3] text-[14px]">
                    Total
                  </p>
                  <p className="text-[#2B2B2B] dark:text-[#D4D4D4] text-[14px] font-semibold">
                    0.00
                  </p>
                </div>
              </div>
            </div>
            {/* buttons */}
            <div className="mt-4">
              <div className="flex flex-row gap-4 pl-1 mb-2 mt-2">
                <div className="w-full gap-1">
                  <ActionButton
                    label="Preview"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                    onClick={PreviewInvoice}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Send this invoice"
                    labelClass="font-normal text-[12px] md:text-[16px] whitespace-nowrap"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={SendTheInvoice}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }
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
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                    onClick={closeModal}
                  />
                </div>
                <div className="w-full gap-1">
                  <ActionButton
                    label="Save"
                    labelClass="font-normal text-[12px] md:text-[16px]"
                    buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={PreviewInvoice}
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
        <h1 className="text-[18px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
          Generate Invoice
        </h1>
      </div>
      <div className="flex flex-col w-full max-h-[80vh] overflow-y-auto px-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
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
          tabLabelClass="text-[12px] lg:text-[14px] font-normal text-center w-full"
          activeTabClass="border-b-[2px] border-[#09BF64] text-[#0F2418] dark:text-[#EFFBF3] font-medium"
          inactiveTabClass="text-[#0F2418] dark:text-[#EBF9F0]"
          tabHeaderClass="flex w-full border-b border-[#09BF64] mt-2"
          contentContainerClass="mt-4 w-full"
          panelClass=""
        />
      </div>
    </div>
  );
}
