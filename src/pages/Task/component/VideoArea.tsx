import React from "react";
import { TrainingData } from "./trainings";

const bgColors: { [key: string]: string } = {
  Completed: "bg-[#AEAEB2]/15",
  "In Progress": "bg-[#F7FCF5]",
  PDF: "bg-[#F1F5F9]",
};

const VideoArea = ({ data }: { data: TrainingData }) => {
  return (
    <div
      className={`${
        bgColors[data.status] || "bg-[#F1F5F9]"
      } rounded-2xl p-4 w-full transition relative overflow-hidden ${
        data.status === "Completed" ? "opacity-75" : ""
      }`}
    >
      <div className="relative rounded-xl overflow-hidden h-[150px] sm:h-[160px] md:h-[180px] lg:h-[200px] flex items-center justify-center bg-white">
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#5A5FEF] text-white text-[10px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 rounded-[6px]">
          {data.status}
        </div>

        <div className="text-center px-2 sm:px-4">
          <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#0D0D0D] dark:text-[#0D0D0D] text-left ml-1 sm:ml-2">
            {data.title}
          </h3>
          <p className="text-left ml-1 sm:ml-2 text-[#0D0D0D] text-[11px] sm:text-[12px] md:text-[13px] max-w-full sm:max-w-[400px]">
            Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h3 className="text-[14px] sm:text-[16px] font-semibold text-[#0D0D0D] dark:text-white">
            {data.title}
          </h3>
          {/* <span className="text-xs text-[#000] font-semibold bg-[#E8E9FF] px-2 py-1 rounded-lg">
            {data.duration}
          </span> */}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-[10px] sm:text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-lg">
            {data.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoArea;
