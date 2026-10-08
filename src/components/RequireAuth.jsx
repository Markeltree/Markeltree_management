import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/LazyLoading";

/** Guards authenticated routes; optionally requires one of `permissions`. */
export default function RequireAuth({ permissions, children }) {
  const { user, loading, can } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullscreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (permissions?.length && !can(...permissions)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <i className="pi pi-lock text-4xl text-[#09BF64] mb-3" />
        <h2 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">Access restricted</h2>
        <p className="text-[14px] text-[#6F7C74] dark:text-[#A9C2B3] mt-1">
          You don't have permission to view this page. Contact HR or an administrator if you need access.
        </p>
      </div>
    );
  }
  return children ?? <Outlet />;
}
