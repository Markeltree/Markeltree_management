import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  useState,
  useEffect,
  Skeleton,
  FieldComponent,
  InputTextarea,
  Dropdown,
  clsx,
} from "@/common/imports";

export default function ShareFeedbackModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closeShareFeedbackModal } = useModal();

  const [subject, setSubject] = useState("");
  const [issueType, setIssueType] = useState(null);
  const [description, setDescription] = useState("");

  const issueTypeOptions = ["Test 1", "Test 2", "Test 3"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Title */}
        <Skeleton width="150px" height="20px" className="dark:bg-[#2C2C2CAA]" />

        {/* row 1 */}
        <div className="flex flex-col gap-2">
          <Skeleton
            width="80px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="40px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* row 2 */}
        <div className="flex flex-col lg:flex-row justify-between gap-2">
          <div className="flex flex-col gap-1 pl-1 w-full">
            <Skeleton
              width="60px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        {/* row 3 */}
        <div className="flex flex-col gap-1 mb-4">
          <Skeleton
            width="70px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="70px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* row 4 */}
        <div className="flex flex-row w-full gap-2">
          <Skeleton
            width="100%"
            height="50px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="50px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-[18px] text-[#0F2418] dark:text-[#B5E6C9] font-bold">
        Share Feedback
      </h1>
      {/* row 1 */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="issueTyoe"
          className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
        >
          Issue Type
        </label>
        <Dropdown
          inputId="issueTyoe"
          value={issueType}
          options={issueTypeOptions}
          onChange={(e) => setIssueType(e.value)}
          placeholder="Select"
          className={clsx(
            "text-[14px] dark:!text-[#A9C2B3] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
          )}
          pt={{
            panel: {
              className:
                "shadow-lg dark:shadow-[0_3px_10px_rgba(255,255,255,0.15)] rounded-md",
            },
          }}
        />
      </div>

      {/* row 2 */}
      <div className="flex flex-col lg:flex-row justify-between gap-2">
        <FieldComponent
          type="text"
          label="Subject"
          name="subject"
          placeholder=""
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          inputClass="text-[14px]  pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
          containerClass="flex flex-col gap-1 pl-1 w-full"
          labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
        />
      </div>

      {/* row 3 */}
      <div className="flex flex-col gap-1 mb-4 ">
        <label
          htmlFor="note"
          className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
        >
          Description
        </label>
        <InputTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          cols={100}
          placeholder=""
          className="h-[70px] pt-1 pl-3 text-[14px] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* row 4 */}
      <div className="flex flex-row w-full gap-4">
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
  );
}
