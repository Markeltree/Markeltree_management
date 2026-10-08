import { Logo } from "@/common/imports";

export const authInputClass =
  "text-[14px] w-full pl-3 border border-b border-[#6F7C7440] dark:border-[#A9C2B3] h-[40px] rounded-lg dark:text-[#A9C2B3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1] hover:shadow-md transition-shadow duration-200 dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] dark:bg-[#0D0D0D]";
export const authLabelClass = "text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]";
export const authButtonClass =
  "text-[16px] h-[45px] w-full bg-[#09BF64] dark:bg-[#81D959] text-white dark:text-black rounded-md font-normal disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:shadow-lg";

/** Two-column layout shared by the sign-in and password-recovery screens. */
export default function AuthShell({ title, subtitle, children, onSubmit, error, notice }) {
  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#0D0D0D]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className="flex flex-col items-center justify-center w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto"
      >
        <div className="w-full max-w-[460px] flex flex-col items-center">
          <div className="mb-2 flex justify-center">
            <Logo lightLogo="/logo-light.png" className="h-12 w-auto" alt="Markeltree" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-[22px] font-bold text-[#2B2B2B] dark:text-[#EFFBF3]">{title}</h1>
            {subtitle && <p className="text-[15px] text-[#8E8E9C] dark:text-[#EFFBF3]">{subtitle}</p>}
          </div>
          {notice && !error && (
            <div role="status" className="w-full mt-4 rounded-lg border border-[#10B98155] bg-[#10B98110] px-3 py-2 text-[13px] text-[#059669]">
              {notice}
            </div>
          )}
          {error && (
            <div role="alert" className="w-full mt-4 rounded-lg border border-[#FF695B55] bg-[#FF695B10] px-3 py-2 text-[13px] text-[#E5483A]">
              {error}
            </div>
          )}
          {children}
        </div>
      </form>

      <div className="hidden lg:flex w-1/2 h-full">
        <div className="w-full h-full p-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img src="/laptop-image.png" alt="Markeltree" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
