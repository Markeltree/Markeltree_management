import React from 'react';

const Paragragh = ({ para = "", color = "", className = "" }) => {
  return (
    <p className={`font-regular text-[#666666] leading-[20px] text-[14px] dark:text-[#EEF8FD]/80 ${color} ${className}`}>
      {para}
    </p>
  );
};

export default Paragragh;
