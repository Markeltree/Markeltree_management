import React from 'react'

const UnderlineButton = ({ Children = "text", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`pb-2 font-semibold text-[#144A2A] dark:text-white ${className}`}
    >
      {Children}
    </button>
  );
};

export default UnderlineButton;
