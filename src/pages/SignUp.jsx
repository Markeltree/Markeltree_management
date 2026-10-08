import {
  Logo,
  ActionButton,
  FieldComponent,
  useState,
  Dropdown,
  clsx,
} from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [role, setRole] = useState(null);
  const roleOptions = ["Role 1", "Role 2"];
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden dark:bg-[#0D0D0D]">
      <div className="grid grid-cols-2 w-full max-w-7xl p-4 lg:p-8 gap-4 lg:gap-8">
        {/* Left Section */}
        <div className="col-span-2 lg:col-span-1 flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="mb-2 flex justify-center">
            <Logo
              lightLogo="/logo-light.png"
              className="h-12 w-auto"
              alt="Markeltree"
            />
          </div>

          {/* Title & Message */}
          <div className="text-center space-y-1">
            <h1 className="text-[22px] font-bold text-[#2B2B2B] dark:text-[#EFFBF3]">
              Create Your Account
            </h1>
            <p className="text-[15px] text-[#8E8E9C] dark:text-[#EFFBF3]">
              Get started with our platform in a few easy steps!
            </p>
          </div>

          <div className="pt-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
              >
                Select your Role
              </label>
              <Dropdown
                inputId="role"
                value={role}
                options={roleOptions}
                onChange={(e) => setRole(e.value)}
                placeholder="Select"
                className={clsx(
                  "text-[14px] dark:!text-[#A9C2B3] dark:bg-[#0D0D0D] border border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)]"
                )}
                panelClassName=""
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="w-full pt-4">
            <FieldComponent
              type="text"
              label="Email Address"
              name="emailAddress"
              placeholder="Enter your email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              inputClass="text-[14px] pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>

          {/* Phone number */}
          <div className="w-full pt-4">
            <FieldComponent
              type="number"
              label="Phone Number"
              name="phoneNumber"
              placeholder="6583845394"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              inputClass="text-[14px] pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>

          {/* Password */}
          <div className="w-full pt-4">
            <FieldComponent
              type="password"
              label="Password"
              name="password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputClass="text-[14px] w-full pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>

          {/* Confirm Password */}
          <div className="w-full pt-4">
            <FieldComponent
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputClass="text-[14px] w-full pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]"
              containerClass="flex flex-col gap-1"
              labelClass="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex justify-between items-center text-[12px] pt-3">
            <label className="flex items-center cursor-pointer text-[#6F7C74] dark:text-[#A9C2B3]">
              <span
                className={`relative w-4 h-4 border border-gray-400 rounded-sm mr-2 flex items-center justify-center
                  ${
                    agree
                      ? "bg-[#09BF64] border-[#09BF64]"
                      : "dark:bg-black dark:border-[#A9C2B3]"
                  }`}
                onClick={() => setAgree(!agree)}
              >
                {agree && (
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
              I agree to the Terms & Conditions.
            </label>
          </div>

          {/* Create Account Button */}
          <div className="flex pt-3">
            <ActionButton
              label="Create Account"
              labelClass="font-normal text-[12px] lg:text[16px]"
              buttonClass="text-[16px] h-[45px] w-full bg-[#09BF64] dark:bg-[#81D959] text-white dark:text-black focus:outline-none focus:ring-0"
              onClick={() => navigate("/login")}
            />
          </div>

          {/* Login link */}
          <div className="text-[12px] flex justify-center items-center text-[#6F7C74] dark:text-[#A9C2B3] pt-6 pb-4">
            Already have an account?{" "}
            <button
              className="text-[#09BF64] underline font-semibold ml-1 hover:text-[#4b4de0]"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex col-span-1 items-center justify-center p-4">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src="/image.png"
              alt="Markeltree"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
