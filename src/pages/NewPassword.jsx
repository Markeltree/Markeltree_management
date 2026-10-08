import { useState, FieldComponent } from "@/common/imports";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/auth/AuthShell";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { email, code } = useLocation().state ?? {};

  if (!email || !code) return <Navigate to="/forgot-password" replace />;

  const submit = async () => {
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return setError("Use at least 8 characters, including a letter and a number.");
    }
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { email, code, password });
      navigate("/login", { replace: true, state: { email, notice: "Password set. You can now log in." } });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const field = (label, name, value, set, placeholder) => (
    <div className="w-full pt-4">
      <FieldComponent
        type="password"
        label={label}
        name={name}
        autoComplete="new-password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => set(e.target.value)}
        inputClass={authInputClass}
        containerClass="flex flex-col gap-1 [&_.p-password]:w-full [&_.p-password_input]:w-full"
        labelClass={authLabelClass}
      />
    </div>
  );

  return (
    <AuthShell title="Create new password" subtitle="At least 8 characters, including a letter and a number." onSubmit={submit} error={error}>
      {field("Password", "password", password, setPassword, "Create your password")}
      {field("Confirm Password", "confirmPassword", confirmPassword, setConfirmPassword, "Re-enter your password")}
      <div className="flex pt-6 w-full">
        <button type="submit" disabled={busy} className={authButtonClass}>
          {busy && <i className="pi pi-spin pi-spinner" />}
          Set password
        </button>
      </div>
    </AuthShell>
  );
}
