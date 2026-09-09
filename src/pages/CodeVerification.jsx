import { Logo, ActionButton, useState, Code } from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function Reset() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#0D0D0D]">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
        {/* Logo */}
        <div className="mb-2 flex justify-center">
          <Logo
            lightLogo="/logo-light.png"
            className="h-12 w-auto"
            alt="CFR management services"
          />
        </div>

        {/* Title & Message */}
        <div className="text-center space-y-1">
          <h1 className="text-[22px] font-bold text-[#2B2B2B] dark:text-[#F2F2FE]">
            Verify Your Account
          </h1>
          <p className="text-[15px] text-[#8E8E9C] dark:text-[#F2F2FE]">
            A verification code has been sent to 86373743545
          </p>
        </div>

        {/* OTP */}
        <div className="flex flex-col items-start gap-2 w-full max-w-md pt-6">
          <h2 className="text-xs text-[#737791] dark:text-[#A9A9CD] font-semibold">
            Enter Code
          </h2>
          <Code
            length={6}
            value={otp}
            onChange={setOtp}
            containerClassName="grid grid-cols-6 gap-4 w-full"
            inputClassName="px-4 w-full h-[45px] md:h-[60px] text-center bg-[#FFFFFF] dark:bg-[#0D0D0D] border border-[#737791] rounded-md text-black dark:text-[#F2F2FE]"
          />
        </div>

        {/* Button */}
        <div className="flex pt-6 w-full max-w-md">
          <ActionButton
            label="Continue"
            labelClass="font-normal text-[12px] lg:text[16px]"
            buttonClass="text-[16px] h-[45px] w-full bg-[#5D5FEF] dark:bg-[#7476F1] text-white dark:text-black focus:outline-none focus:ring-0"
            onClick={() => navigate("/dashboard")}
          />
        </div>

        {/* Resend Link */}
        <div className="pt-8">
          <span className="flex justify-center items-center w-full text-xs text-[#8E8E9C] dark:text-[#F2F2FE]">
            Not received verification code?{" "}
            <button
              className="text-[#5D5FEF] underline font-semibold hover:text-[#4b4de0] ml-1"
              onClick={() => console.log("Resend clicked")}
            >
              Resend
            </button>
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 h-full">
        <div className="w-full h-full p-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src="/image.png"
              alt="CFR Management Services"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
