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
  Calendar,
} from "@/common/imports";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";

export default function GenerateReportModal({ closeModal }) {
  const { openModal, closeModal: closeGenerateReportModal } = useModal();

  const [reportType, setReportType] = useState(null);
  const [reportName, setReportName] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartType, setChartType] = useState(null);
  const [chooseData, setChooseData] = useState(null);

  const reportTypeOptions = ["Sale", "Inventory"];
  const [checked, setChecked] = useState({
    "Order Id": false,
    " Customer Name": false,
    "Article Number": true,
    "Order Date": true,
    "Amount Status": false,
  });

  const toggleCheck = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [chartRows, setChartRows] = useState([
    { chartType: null, chooseData: null },
  ]);
  const chartTypeOptions = ["Sales", "Inventory"];
  const chooseDataOptions = ["Data 1", "Data 2"];

  const handleChartRowChange = (index, field, value) => {
    setChartRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addMoreChart = () => {
    setChartRows((prev) => [...prev, { chartType: null, chooseData: null }]);
  };

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Header */}
        <Skeleton width="150px" height="24px" className="dark:bg-[#2C2C2CAA]" />

        <div className="flex flex-col pr-3 w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          {/* fields - row 1 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-2 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-2 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* fields - row 2 */}
          <div className="flex flex-col gap-2 mb-2 pl-1 pr-1">
            <Skeleton
              width="100px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* fields - row 3 (checkboxes) */}
          <div className="flex flex-wrap gap-6 pl-1 mb-4">
            <div className="w-full">
              <Skeleton
                width="120px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <div className="grid grid-cols-2 gap-y-3 gap-x-8 pt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton
                      width="16px"
                      height="16px"
                      className="rounded dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="60px"
                      height="12px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* row 4 (radio buttons) */}
          <div className="flex flex-col gap-2 mb-4 pl-1">
            <Skeleton
              width="60px"
              height="12px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <div className="flex flex-row gap-6">
              <div className="flex items-center gap-2">
                <Skeleton
                  width="14px"
                  height="14px"
                  className="rounded-full dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="80px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton
                  width="14px"
                  height="14px"
                  className="rounded-full dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="80px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          </div>

          {/* row 5 (dropdowns) */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full gap-2 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col w-full gap-2 pl-1">
              <Skeleton
                width="80px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mb-4 pl-1">
            <div className="w-full gap-1">
              <Skeleton
                width="120px"
                height="25px"
                borderRadius="6px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-row gap-4 mb-2 pl-1">
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
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}

      <div className=" text-[20px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
        Generate Report
      </div>

      <div className="flex flex-col pr-3 w-full max-h-[60vh] lg:max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        {/* fields - row 1*/}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full gap-1 pl-1">
            <label
              htmlFor="reportType"
              className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            >
              Report Type
            </label>
            <Dropdown
              inputId="reportType"
              value={reportType}
              options={reportTypeOptions}
              onChange={(e) => setReportType(e.value)}
              placeholder="Sales"
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
              label="Report Name"
              name="reportName"
              placeholder=""
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1 pr-1 pl-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>
        </div>

        {/* fields - row 2*/}
        <div className="flex flex-col gap-1 mb-2 pl-1 pr-1">
          <label className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">
            Report Duration
          </label>
          <div className="relative w-full">
            <DatePicker
              selectsRange
              startDate={dateRange ? dateRange[0] : null}
              endDate={dateRange ? dateRange[1] : null}
              onChange={(update) => setDateRange(update)}
              isClearable
              placeholderText="Select date"
              dateFormat="MM/dd/yyyy"
              wrapperClassName="w-full"
              className="w-full h-[40px] px-3 pr-10 text-[14px] border border-[#6F7C7440] 
      dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] 
      dark:bg-[#0D0D0D] focus:outline-none focus:ring-0"
            />

            {/* Custom Calendar Icon */}
            <span className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
              <i className="pi pi-calendar text-[#09BF64] dark:text-[#09BF64]" />
            </span>
          </div>
        </div>

        {/* fields - row 3*/}
        <div className="flex flex-wrap gap-6 pl-1 mb-4">
          <div className="w-full pl-1">
            {/* Label */}
            <label className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">
              Select Report Fields
            </label>

            {/* Checkboxes grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 pt-1">
              {Object.keys(checked).map((key, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  {/* Custom checkbox */}
                  <div
                    className={`relative w-4 h-4 flex items-center justify-center rounded border border-[#8E8E9C] transition-colors
              ${
                checked[key]
                  ? "bg-[#09BF64] border-[#09BF64] border-none"
                  : "bg-white border-[#8E8E9C] dark:bg-[#141414] dark:border-white"
              }`}
                    onClick={() => toggleCheck(key)}
                  >
                    {checked[key] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white dark:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label text */}
                  <span className="text-[10px] md:text-[12px] text-[#8E8E9C] capitalize whitespace-nowrap">
                    {key.replace("option", "Option ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* row 4 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex flex-col gap-2 pl-1">
            <span className="text-[12px] font-medium text-[#6F7C74] dark:text-[#A9C2B3]">
              Chart
            </span>
            <div className="flex flex-row gap-6">
              <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                <input
                  type="radio"
                  name="chart"
                  value="pallet"
                  className="mr-2 accent-[#09BF64]"
                  // defaultChecked // uncomment if you want default selection
                />
                Without Chart
              </label>
              <label className="flex items-center cursor-pointer text-[12px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                <input
                  type="radio"
                  name="chart"
                  value="cartons"
                  className="mr-2 accent-[#09BF64]"
                  defaultChecked
                />
                Include Chart
              </label>
            </div>
          </div>
        </div>

        {/* row 5 */}
        {chartRows.map((row, index) => (
          <div key={index} className="flex flex-col lg:flex-row gap-4 mb-2">
            <div className="flex flex-col w-full gap-1 pl-1">
              <label
                htmlFor={`chartType-${index}`}
                className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              >
                Chart Type
              </label>
              <Dropdown
                inputId={`chartType-${index}`}
                value={row.chartType}
                options={chartTypeOptions}
                onChange={(e) =>
                  handleChartRowChange(index, "chartType", e.value)
                }
                placeholder="Sales"
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
                htmlFor={`chooseData-${index}`}
                className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              >
                Choose Data
              </label>
              <Dropdown
                inputId={`chooseData-${index}`}
                value={row.chooseData}
                options={chooseDataOptions}
                onChange={(e) =>
                  handleChartRowChange(index, "chooseData", e.value)
                }
                placeholder="Sales"
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
        ))}

        {/* row 6 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4 pl-1">
          <div className="w-full gap-1">
            <ActionButton
              label="Add more chart"
              labelClass="font-normal text-[11px] lg:text[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm h-[25px] w-[120px] px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
              onClick={addMoreChart}
            />
          </div>
        </div>

        {/* button */}
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
              label="Submit"
              labelClass="font-normal text-[12px] md:text-[16px]"
              buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
