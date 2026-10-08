import React from "react";

type HeadingTwoProps = {
  text: React.ReactNode;
  className?: string;
};

const HeadingTwo: React.FC<HeadingTwoProps> = ({ text, className = "" }) => {
  return (
    <h2 className={`text-[20px] font-bold text-[#0B1B33] dark:text-white ${className}`}>
      {text}
    </h2>
  );
};

export default HeadingTwo;
