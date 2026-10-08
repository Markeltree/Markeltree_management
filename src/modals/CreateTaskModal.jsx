import { useModal } from "@/context/ModalContext";
import {
  useState,
  useEffect,
  Icon,
  FieldComponent,
  ActionButton,
  DateField,
  Skeleton,
  MultiSelectDropdown,
  TaskReportModal,
} from "@/common/imports";

export default function CreateTaskModal({ closeModal }) {
  const [isLoading, setIsLoading] = useState(true);

  const { openModal, closeModal: closeCreateTaskModal } = useModal();

  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(null);

  const handleSave = () => {
    closeModal();
    setTimeout(() => {
      openModal(TaskReportModal, {
        sizeClass: "w-[85%] md:w-[70%]",
      });
    }, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        {/* Heading */}
        <Skeleton
          width="150px"
          height="24px"
          className="mb-1 dark:bg-[#2C2C2CAA]"
        />
        {/* className="dark:bg-[#2C2C2CAA]" */}
        {/* Task Input */}
        <div className="flex flex-col lg:flex-row justify-between w-full gap-3">
          <div className="w-full flex flex-col gap-1 pl-1">
            <Skeleton
              width="80px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        {/* Deadline Picker */}
        <div className="flex flex-col w-full gap-1 pl-1">
          <Skeleton
            width="80px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="40px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>

        {/* MultiSelect Placeholder */}
        <div className="flex flex-col w-full gap-1 pl-1">
          <Skeleton
            width="80px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton height="40px" className="rounded-lg dark:bg-[#2C2C2CAA]" />
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2 mt-3 mb-2">
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
    <div className="space-y-3">
      <h1 className="text-[18px] text-[#0B1B33] dark:text-[#B5DEF2] font-bold">
        Create Task
      </h1>
      <div className="flex flex-col lg:flex-row justify-between w-full gap-3">
        <FieldComponent
          type="text"
          label="Task"
          name="task"
          placeholder="Update inventory"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          inputClass="text-[14px]  pl-3 border border-b border-[#6E7A8640] dark:border-[#A9BACB] h-[40px] rounded-lg dark:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
          containerClass="w-full flex flex-col gap-1 pl-1"
          labelClass="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]"
        />
      </div>

      <div className="flex flex-col w-full gap-1 pl-1">
        <DateField
          label="Deadline"
          value={deadline}
          onChange={(date) => setDeadline(date)} // <-- date is a Date object
        />
      </div>

      <MultiSelectDropdown />

      <div className="flex flex-row gap-4 pl-1 mb-2 mt-2">
        <div className="w-full gap-1">
          <ActionButton
            label="Cancel"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={closeModal}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Save"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
