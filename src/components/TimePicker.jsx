import { useState, Icon, useRef, useEffect, Calendar } from "@/common/imports";

export default function TimePicker({ value, onChange }) {
  const timePickerRef = useRef(null);

  return (
    <div className="relative w-full">
      <Calendar
        value={value}
        onChange={(e) => onChange(e.value)}
        timeOnly
        ref={timePickerRef}
        inputId="time"
        placeholder="Select Time"
        showIcon={false}
        className="w-full"
        panelClassName="z-50 translate-y-2 custom-time-panel"
        inputClassName="w-full pl-3 pr-10 h-[40px] border border-[#6E7A8640] dark:border-[#A9BACB] rounded-lg dark:text-[#A9BACB] focus:!rounded-lg dark:bg-[#0D0D0D] text-[14px] placeholder:text-[#A9BACB] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
      />
      <Icon
        icon="mdi:clock-outline"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0088D1] cursor-pointer"
        width={20}
        height={20}
        onClick={() => timePickerRef.current?.input?.click()}
      />
    </div>
  );
}
