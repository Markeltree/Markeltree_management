import { createContext, useContext, useMemo, useRef } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const ref = useRef(null);
  const api = useMemo(
    () => ({
      success: (detail, summary = "Done") => ref.current?.show({ severity: "success", summary, detail, life: 3000 }),
      error: (detail, summary = "Something went wrong") =>
        ref.current?.show({ severity: "error", summary, detail: detail?.message ?? String(detail), life: 6000 }),
      info: (detail, summary = "Info") => ref.current?.show({ severity: "info", summary, detail, life: 4000 }),
    }),
    []
  );
  return (
    <ToastContext.Provider value={api}>
      <Toast ref={ref} position="top-right" />
      <ConfirmDialog />
      {children}
    </ToastContext.Provider>
  );
}
