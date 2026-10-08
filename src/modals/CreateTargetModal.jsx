import "../index.css";
import {
  useState,
  useEffect,
  Icon,
  FieldComponent,
  ActionButton,
  Dropdown,
  InputTextarea,
  DateField,
  clsx,
  Skeleton,
} from "@/common/imports";

export default function CreateTargetModal({ closeModal, onNext }) {
  const [targetAmount, setTargetAmount] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const priorityOptions = ["Low", "Medium", "High"];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    const formData = { targetAmount, date, priority, notes };
    console.log("Submitting:", formData);
    if (onNext) onNext(formData); // send to parent
  };

  if (isLoading) {
    return (
      <div className="space-y-3 gap-4 mt-4">
        <Skeleton width="20%" height="20px" className="dark:bg-[#2C2C2CAA]" />
        <div className="flex flex-col gap-8">
          <Skeleton
            height="3rem"
            className="rounded-lg col-span-2 md:col-span-1 dark:bg-[#2C2C2CAA]"
          />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton
              height="3rem"
              className="rounded-lg col-span-2 lg:col-span-1 dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="3rem"
              className="rounded-lg col-span-2 lg:col-span-1 dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            height="5rem"
            className="rounded-lg col-span-2 md:col-span-1 dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="3rem"
            className="rounded-lg col-span-2 md:col-span-1 dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between p-0">
        <h1 className="text-xl font-bold text-[#0F2418] dark:text-[#EFFBF3]">
          Create Target
        </h1>
      </div>

      <FieldComponent
        type="number"
        label="Target Amount"
        name="targetAmount"
        placeholder="Enter target amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.value)}
        inputClass="text-[14px] dark:text-[#A9C2B3] pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
        containerClass="flex flex-col w-full gap-2"
        labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col w-full gap-2 col-span-2 md:col-span-1">
          <DateField
            label="Deadline"
            value={date}
            onChange={(date) => setDate(date)} // <-- date is a Date object
          />
        </div>
        <div className="flex flex-col w-full gap-1 col-span-2 md:col-span-1">
          <label
            htmlFor="priority"
            className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
          >
            Select Priority
          </label>
          <Dropdown
            inputId="priority"
            value={priority}
            options={priorityOptions}
            onChange={(e) => setPriority(e.value)}
            placeholder="Select Priority"
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
      </div>
      <div className="flex flex-col w-full gap-2">
        <label
          htmlFor="notes"
          className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
        >
          Notes (optional)
        </label>
        <InputTextarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          cols={100}
          placeholder="Add additional details"
          className="h-[76px] pt-1 pl-3 text-[14px] dark:text-[#A9C2B3] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
        />
      </div>

      <div className="flex justify-end">
        <ActionButton
          label="Next"
          labelClass="font-normal text-[12px] md:text-[16px]"
          buttonClass="text-[16px] h-[48px] w-full bg-[#09BF64] dark:bg-[#81D959] text-white dark:text-black focus:outline-none focus:ring-0"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
