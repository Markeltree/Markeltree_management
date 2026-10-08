import React from "react";

interface ProgressBarProps {
  progress: number; // e.g. 90
}

const LearningProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-[600px] bg-white rounded-full shadow-md p-4 flex items-center justify-between">
      <span className="text-[16px] sm:text-[12px] font-medium text-[#2B2B2B]">
        Your Learning Progress
      </span>

      <div className="flex-1 mx-4 relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#09BF64] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <span className="text-sm sm:text-base font-semibold text-gray-700">
        {progress}%
      </span>
    </div>
  );
};

export default LearningProgressBar;
