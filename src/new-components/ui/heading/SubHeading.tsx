import React from "react";

type SubHeadingProps = {
  text: string | number;
  className?: string;
  colorClass?: string; // For custom text color (optional)
};

const SubHeading: React.FC<SubHeadingProps> = ({
  text,
  className = "",
  colorClass = "text-[#6F7C74] dark:text-white",
}) => {
  return (
    <span
      className={`text-[10px] sm:text-[10px] font-regular ${colorClass} ${className}`}
    >
      {text}
    </span>
  );
};

export default SubHeading;
