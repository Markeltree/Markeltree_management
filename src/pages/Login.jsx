import { FieldComponent, useState } from "@/common/imports";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/auth/AuthShell";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  const submit = async () => {
    if (!email || !password) return setError("Enter your email and password.");
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Login to Your Account"
      subtitle="Access your account securely and manage your work with ease."
      onSubmit={submit}
      error={error}
      notice={location.state?.notice}
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

      <div className="w-full pt-4">
        <FieldComponent
          type="password"
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClass={authInputClass}
          containerClass="flex flex-col gap-1 [&_.p-password]:w-full [&_.p-password_input]:w-full"
          labelClass={authLabelClass}
        />
      </div>

      <div className="flex justify-end items-center text-[12px] pt-3 w-full">
        <button
          type="button"
          className="text-[#09BF64] font-semibold ml-1 hover:underline"
          onClick={() => navigate("/forgot-password", { state: { email } })}
        >
          Forgot Password?
        </button>
      </div>

      <div className="flex pt-3 w-full">
        <button type="submit" disabled={busy} className={authButtonClass}>
          {busy && <i className="pi pi-spin pi-spinner" />}
          Login
        </button>
      </div>

      <p className="text-[12px] text-[#8E8E9C] pt-4 text-center">
        Accounts are created by HR. New here? Use <span className="font-semibold">Forgot Password</span> with your work email to activate your account.
      </p>
    </AuthShell>
  );
}
