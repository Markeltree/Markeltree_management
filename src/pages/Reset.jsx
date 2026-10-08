import { useState, Code } from "@/common/imports";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import AuthShell, { authButtonClass } from "@/components/auth/AuthShell";

export default function Reset() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const email = useLocation().state?.email;

  if (!email) return <Navigate to="/forgot-password" replace />;

  const submit = async () => {
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code.");
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/verify-reset-code", { email, code: otp });
      navigate("/password", { state: { email, code: otp } });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setNotice("A new code has been sent.");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AuthShell title="Enter Reset Code" subtitle={`If an account exists for ${email}, a 6-digit code has been sent to it.`} onSubmit={submit} error={error}>
      <div className="w-full pt-6">
        <h2 className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3] mb-1">Code</h2>
        <Code
          length={6}
          value={otp}
          onChange={setOtp}
          containerClassName="grid grid-cols-6 gap-4 w-full"
          inputClassName="px-4 w-full h-[45px] md:h-[60px] text-center bg-[#FFFFFF] dark:bg-[#0D0D0D] border border-[#6F7C74] rounded-md text-black dark:text-[#EFFBF3]"
        />
      </div>
      <div className="flex pt-6 w-full">
        <button type="submit" disabled={busy} className={authButtonClass}>
          {busy && <i className="pi pi-spin pi-spinner" />}
          Continue
        </button>
      </div>
      <div className="text-center pt-4 text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">
        {notice || "Not received the code?"}{" "}
        <button type="button" onClick={resend} className="text-[#09BF64] font-semibold hover:underline">
          Resend
        </button>
      </div>
    </AuthShell>
  );
}
