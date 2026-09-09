import React, { useRef, useState } from "react";

export default function Code({
  length = 6,
  value = "",
  onChange,
  inputClassName = "w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
  containerClassName = "flex gap-2 justify-center",
  example = "123456", // default example OTP
}) {
  const inputsRef = useRef([]);
  const [isFocused, setIsFocused] = useState(false); // track if any input is clicked

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // allow only digits

    const otp = value.split("");
    otp[index] = val;
    const newValue = otp.join("").slice(0, length);
    onChange?.(newValue);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const otp = value.split("");
      otp[index - 1] = "";
      onChange?.(otp.join(""));
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleFocus = () => {
    if (!isFocused) setIsFocused(true); // remove placeholders once any input is focused
  };

  return (
    <div className={containerClassName}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          placeholder={!isFocused ? example[index] : ""} // show example only if not focused
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={handleFocus} // clear all placeholders on first focus
          className={inputClassName}
          ref={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </div>
  );
}
