// Shared building blocks for the HR modules, styled to match the existing dashboard.
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Icon } from "@iconify/react";
import CustomPaginator from "@/components/CustomPaginator";
import { fullName, humanize } from "./utils";

// ── Layout ───────────────────────────────────────────────────────

export function Page({ children }) {
  return <div className="flex-1 px-3 pt-4 pb-6 bg-gray-50 dark:bg-[#141414] space-y-4">{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 className="text-[14px] font-semibold text-[#0088D1] whitespace-nowrap">{title}</h1>
        {subtitle && <p className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:gap-3">{actions}</div>}
    </div>
  );
}

export function Panel({ title, subtitle, actions, children, className = "", bodyClass = "" }) {
  return (
    <section className={`bg-white dark:bg-[#000000] rounded-lg p-4 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            {title && <h2 className="text-[#333333] dark:text-[#EEF8FD] font-bold text-[16px]">{title}</h2>}
            {subtitle && <p className="text-[12px] text-[#666666] dark:text-[#A9BACB]">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

const TONES = {
  primary: "bg-[#0088D11A] text-[#0088D1]",
  success: "bg-[#10B9811A] text-[#059669]",
  warning: "bg-[#F59E0B1A] text-[#D97706]",
  danger: "bg-[#FF695B1A] text-[#E5483A]",
  neutral: "bg-[#8E8E9C1A] text-[#6E7A86] dark:text-[#A9BACB]",
  info: "bg-[#0EA5E91A] text-[#0284C7]",
};

export function StatCard({ label, value, icon, tone = "primary", hint, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-black rounded-lg p-4 flex items-center gap-3 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${TONES[tone]}`}>
          <Icon icon={icon} width={22} height={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB] truncate">{label}</p>
        <p className="text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD] leading-tight">{value ?? "—"}</p>
        {hint && <p className="text-[11px] text-[#8E8E9C]">{hint}</p>}
      </div>
    </div>
  );
}

const STATUS_TONE = {
  ACTIVE: "success", PRESENT: "success", APPROVED: "success", DONE: "success", COMPLETED: "success",
  LATE: "warning", EARLY_DEPARTURE: "warning", LATE_AND_EARLY: "warning", PENDING: "warning", PROBATION: "warning",
  REVIEW: "info", IN_PROGRESS: "info", ON_LEAVE: "info", INVITED: "info", NOTICE_PERIOD: "warning", CHANGES_REQUESTED: "warning",
  ABSENT: "danger", REJECTED: "danger", SUSPENDED: "danger", DEACTIVATED: "danger", EXITED: "neutral", CANCELLED: "neutral",
  HOLIDAY: "primary", WEEKEND: "neutral", TODO: "neutral", NOT_JOINED: "neutral",
  URGENT: "danger", HIGH: "warning", MEDIUM: "info", LOW: "neutral",
};

export function Badge({ value, tone, children }) {
  const t = tone ?? STATUS_TONE[value] ?? "neutral";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${TONES[t]}`}>
      {children ?? humanize(value)}
    </span>
  );
}

export function Avatar({ person, size = 32 }) {
  const initials = `${person?.firstName?.[0] ?? ""}${person?.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  if (person?.avatarUrl) {
    return <img src={person.avatarUrl} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="rounded-full bg-[#0088D1] text-white flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function PersonCell({ person, sub }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar person={person} />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[#0B1B33] dark:text-[#EEF8FD] truncate">{fullName(person)}</p>
        {sub && <p className="text-[11px] text-[#8E8E9C] truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ── Controls ─────────────────────────────────────────────────────

const BTN = {
  primary: "bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border border-[#0088D1]",
  outline: "bg-white text-[#0088D1] dark:bg-[#0D0D0D] border border-[#0088D1]",
  ghost: "bg-white text-[#333] dark:bg-[#0D0D0D] dark:text-[#A9BACB] border border-[#A9A9A9] dark:border-[#8E8E9C]",
  danger: "bg-[#FF695B] text-white border border-[#FF695B]",
  success: "bg-[#10B981] text-white border border-[#10B981]",
};

export function Btn({ label, icon, variant = "primary", onClick, disabled, loading, type = "button", size = "md", className = "", title }) {
  const sz = size === "sm" ? "h-[30px] px-3 text-[11px]" : "h-[38px] md:h-[42px] px-4 text-[12px]";
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${sz} ${BTN[variant]} ${className}`}
    >
      {loading ? <i className="pi pi-spin pi-spinner text-[12px]" /> : icon && <Icon icon={icon} width={16} height={16} />}
      {label}
    </button>
  );
}

export function IconBtn({ icon, title, onClick, tone = "primary", disabled }) {
  const cls =
    tone === "danger"
      ? "border-[#FF695B] text-[#FF695B]"
      : tone === "solid"
        ? "bg-[#0088D1] border-[#0088D1] text-white"
        : "border-[#0088D1] text-[#0088D1]";
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex border p-1 w-7 h-6 rounded items-center justify-center disabled:opacity-40 ${cls}`}
    >
      <Icon icon={icon} width={15} height={15} />
    </button>
  );
}

const inputCls =
  "w-full text-[13px] px-3 border border-[#6E7A8640] dark:border-[#A9BACB55] h-[40px] rounded-lg text-[#0B1B33] dark:text-[#EEF8FD] bg-white dark:bg-[#0D0D0D] focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] disabled:opacity-60";

export function Field({ label, required, hint, error, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">
          {label} {required && <span className="text-[#FF695B]">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="text-[11px] text-[#8E8E9C]">{hint}</span>}
      {error && <span className="text-[11px] text-[#E5483A]">{error}</span>}
    </label>
  );
}

export const Input = (props) => <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;

export const TextArea = (props) => (
  <textarea {...props} className={`${inputCls} h-auto min-h-[90px] py-2 ${props.className ?? ""}`} />
);

export function Select({ options = [], placeholder, ...props }) {
  return (
    <select {...props} className={`${inputCls} ${props.className ?? ""}`}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center">
        <Icon icon="mdi:magnify" className="text-xl text-[#0088D1]" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full md:w-[250px] h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
      />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-5 border-b border-[#6E7A8626] overflow-x-auto scrollbar-hide">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`pb-2 text-[13px] font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            active === t.key ? "text-[#0088D1] border-b-2 border-[#0088D1]" : "text-[#6E7A86] dark:text-[#A9BACB] hover:text-[#0088D1]"
          }`}
        >
          {t.label}
          {t.count > 0 && <span className="bg-[#0088D1] text-white text-[10px] px-1.5 rounded-full">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#FF695B55] bg-[#FF695B10] px-3 py-2 text-[13px] text-[#E5483A]">
      <span>{error.message ?? String(error)}</span>
      {onRetry && (
        <button className="underline font-semibold" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function Empty({ icon = "mdi:inbox-outline", text = "Nothing here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-[#8E8E9C] gap-2">
      <Icon icon={icon} width={34} height={34} />
      <p className="text-[13px]">{text}</p>
    </div>
  );
}

/** PrimeReact DataTable with the dashboard's table styling, skeleton rows and server pagination. */
export function Table({ columns, rows, loading, emptyText = "No records found.", page, totalPages, onPageChange, onRowClick, dataKey = "id" }) {
  if (loading && !rows?.length) {
    return (
      <div className="flex flex-col gap-3 pt-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="22px" className="dark:bg-[#2C2C2CAA]" />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="overflow-x-auto w-full">
        <DataTable
          value={rows ?? []}
          dataKey={dataKey}
          className={`p-datatable-sm w-full [&_.p-datatable-tbody>tr]:dark:!bg-black ${loading ? "opacity-60" : ""}`}
          rowClassName={() =>
            `border-b border-[#6E7A8626] text-[13px] text-[#666666] dark:text-[#EEF8FD] dark:bg-black whitespace-nowrap ${onRowClick ? "cursor-pointer" : ""}`
          }
          onRowClick={onRowClick ? (e) => onRowClick(e.data) : undefined}
          emptyMessage={<Empty text={emptyText} />}
        >
          {columns.map((col) => (
            <Column
              key={col.field ?? col.header}
              field={col.field}
              header={col.header}
              body={col.body}
              headerClassName="text-[12px] text-[#33333380] dark:text-[#8E8E9C] dark:bg-black font-semibold bg-white whitespace-nowrap"
              style={col.style}
            />
          ))}
        </DataTable>
      </div>
      {onPageChange && <CustomPaginator totalPages={totalPages} currentPage={(page ?? 1) - 1} onPageChange={(p) => onPageChange(p + 1)} maxButtons={5} />}
    </>
  );
}

/** Simple modal body wrapper for forms opened through ModalContext. */
export function ModalForm({ title, subtitle, children, onSubmit, submitLabel = "Save", saving, onCancel, error }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4 max-h-[80vh]"
    >
      <div className="pr-8">
        <h2 className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{title}</h2>
        {subtitle && <p className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">{subtitle}</p>}
      </div>
      <div className="overflow-y-auto pr-1 flex flex-col gap-3">{children}</div>
      <ErrorNote error={error} />
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && <Btn variant="outline" label="Cancel" onClick={onCancel} />}
        <Btn type="submit" label={submitLabel} loading={saving} />
      </div>
    </form>
  );
}
