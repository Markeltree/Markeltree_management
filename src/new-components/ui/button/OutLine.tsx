import React from "react";

type OutlineBtnProps = {
  BtnName: string;
  icon?: React.ElementType;
  className?: string;
  onClick?: () => void;
};

const OutlineBtn: React.FC<OutlineBtnProps> = ({
  BtnName,
  icon: Icon,
  className = "",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 border border-[#0088D1] text-[#0088D1] 
        rounded-sm bg-transparent hover:bg-indigo-400 hover:text-[#fff] hover:border-[#fff]
        font-medium sm:text-base
        w-full sm:w-auto px-3 py-2 transition-all ${className}`}
    >
      {Icon && (
        <Icon className="w-[20px] h-[20px] max-sm:w-[12px] max-sm:h-[12px]" />
      )}
      <span className="whitespace-nowrap text-[14px]">{BtnName}</span>
    </button>
  );
};

export default OutlineBtn;
