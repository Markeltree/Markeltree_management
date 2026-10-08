import { FieldComponent, useState } from "@/common/imports";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/auth/AuthShell";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      navigate("/reset", { state: { email: email.trim() } });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your work email and we'll send you a 6-digit code to reset or activate your account."
      onSubmit={submit}
      error={error}
    >
      <div className="w-full pt-4">
        <FieldComponent
          type="text"
          label="Email Address"
          name="email"
          autoComplete="username"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputClass={authInputClass}
          containerClass="flex flex-col gap-1"
          labelClass={authLabelClass}
        />
      </div>
      <div className="flex pt-6 w-full">
        <button type="submit" disabled={busy} className={authButtonClass}>
          {busy && <i className="pi pi-spin pi-spinner" />}
          Send code
        </button>
      </div>
      <button type="button" onClick={() => navigate("/login")} className="text-[12px] text-[#0088D1] font-semibold hover:underline pt-4">
        Back to login
      </button>
    </AuthShell>
  );
}
