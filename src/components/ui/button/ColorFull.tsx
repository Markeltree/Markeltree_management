import React from "react";
import { FiDownload } from "react-icons/fi";

type ColorFullProps = {
  text?: string;
  icon?: React.ElementType;
  bgColor?: string;
  textColor?: string;
  className?: string;
  fontSize?: string;
  onClick?: () => void;
  iconProps?: React.ComponentProps<'svg'>;
};

const ColorFull: React.FC<ColorFullProps> = ({
  text = "Select Date Range",
  icon: Icon = FiDownload,
  bgColor = "bg-[#0088D1]/20",
  textColor = "text-[#0088D1]",
  fontSize = "text-sm",
  className = "",
  onClick,
  iconProps = {},
}) => {
  return (
    <button
      onClick={onClick}
      className={`font-medium border-[1px] ${textColor} ${bgColor} ${fontSize} ${className} w-full sm:w-auto py-3 rounded-sm border-[#5D5FE1]/10 hover:border-[#0088D1] hover:border-[1px] hover:shadow-md hover:shadow-[#0088D1]/30 dark:bg-[#01CEE9]/10 dark:text-[#01CEE9] dark:hover:border-[#0088D1]/30 dark:hover:shadow-md dark:hover:shadow-[#fff]/30 flex h-9 items-center gap-2  px-4 sm:h-9 min-w-[120px] sm:min-w-[140px] transition-all overflow-hidden`}
    >
      <Icon className="w-[20px] h-[20px] max-sm:w-[12px] max-sm:h-[12px] flex-shrink-0" {...iconProps} />
      <span className="truncate whitespace-nowrap overflow-hidden flex-1" title={text}>
        {text}
      </span>
    </button>
  );
};

export default ColorFull;
