import { useState, useEffect } from "react";
import { useModal } from "@/context/ModalContext";
import { ActionButton, Skeleton } from "@/common/imports";

export default function WorkflowConfigureModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3">
      {isLoading ? (
        <>
          {/* Skeleton for title */}
          <Skeleton
            width="8rem"
            height="1.5rem"
            className="dark:bg-[#2C2C2CAA]"
          />

          {/* Skeleton for form */}
          <Skeleton
            width="100%"
            height="2.5rem"
            className="dark:bg-[#2C2C2CAA] rounded-md"
          />
          <Skeleton
            width="100%"
            height="5rem"
            className="dark:bg-[#2C2C2CAA] rounded-md"
          />
          <div className="flex gap-3 mt-4">
            <Skeleton
              width="50%"
              height="2.75rem"
              className="rounded-md dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="50%"
              height="2.75rem"
              className="rounded-md dark:bg-[#2C2C2CAA]"
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[18px] text-[#151D48] dark:text-[#B7BFEA] font-bold">
            Workflow Configure
          </h1>

          <div className="rounded-xl bg-white dark:bg-[#141414AA] p-3 flex flex-col gap-4">
            {/* Workflow Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#151D48] text-sm dark:text-[#B7BFEA]">
                Workflow Name
              </label>
              <input
                type="text"
                placeholder="Enter workflow name"
                className="border rounded-md px-3 py-2 text-sm dark:bg-[#0D0D0D] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Workflow Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[#151D48] text-sm dark:text-[#B7BFEA]">
                Workflow Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter workflow description"
                className="border rounded-md px-3 py-2 text-sm dark:bg-[#0D0D0D] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <ActionButton
                label="Cancel"
                labelClass="font-normal text-[12px] md:text-[16px]"
                buttonClass="flex items-center justify-center h-[45px] w-1/2 px-4 rounded-lg border border-[#5D5FEF] text-[#5D5FEF] bg-white dark:bg-[#0D0D0D] dark:text-[#5D5FEF]"
                onClick={closeModal}
              />
              <ActionButton
                label="Next"
                labelClass="font-normal text-[12px] md:text-[16px]"
                buttonClass="flex items-center justify-center h-[45px] w-1/2 px-4 rounded-lg bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-[#0D0D0D]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
