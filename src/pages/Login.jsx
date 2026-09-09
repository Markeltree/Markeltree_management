import { Logo, ActionButton, FieldComponent, useState } from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [emailAddress, setEmailAddress] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#0D0D0D]">
      {/* <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto"> */}
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
            Login to Your Account
          </h1>
          <p className="text-[15px] text-[#8E8E9C] dark:text-[#F2F2FE]">
            Access your account securely and manage your tasks with ease.
          </p>
        </div>

        {/* Form Fields */}

        <div className="w-full pt-4">
          <FieldComponent
            type="text"
            label="Email Address"
            name="emailAddress"
            placeholder="Enter your email address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            inputClass="text-[14px] pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>

        <div className="w-full pt-4">
          <FieldComponent
            type="password"
            label="Password"
            name="password"
            placeholder="Create your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputClass="text-[14px] w-full pl-3 border border-b border-[#73779140] dark:border-[#A9A9CD] h-[40px] rounded-lg dark:text-[#A9A9CD] focus:outline-none focus:ring-1 focus:ring-[#B9B9FB] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
            containerClass="flex flex-col gap-1"
            labelClass="text-[12px] text-[#737791] dark:text-[#A9A9CD]"
          />
        </div>

        <div className="flex justify-between items-center text-[12px] pt-3 w-full">
          <label className="flex items-center cursor-pointer text-[#737791] dark:text-[#A9A9CD]">
            <span
              className={`relative w-4 h-4 border border-gray-400 rounded-sm mr-2 flex items-center justify-center
                  ${
                    rememberMe
                      ? "bg-[#5D5FEF] border-[#5D5FEF]"
                      : "dark:bg-black dark:border-[#A9A9CD]"
                  }`}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && (
                <svg
                  className="w-3 h-3 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            Remember me
          </label>
          <button
            className="text-[#5D5FEF] font-semibold ml-1  hover:underline"
            onClick={() => navigate("/password")}
          >
            Forget Password?
          </button>
        </div>

        <div className="flex pt-3 w-full">
          <ActionButton
            label="Login"
            labelClass="font-normal text-[12px] lg:text[16px]"
            buttonClass="text-[16px] h-[45px] w-full bg-[#5D5FEF] dark:bg-[#7476F1] text-white dark:text-black focus:outline-none focus:ring-0"
            onClick={() => navigate("/verification")}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 h-full">
        <div className="w-full h-full p-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src="/laptop-image.png"
              alt="CFR Management Services"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
