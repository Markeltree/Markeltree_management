import { InputTextarea } from "@/common/imports";

export default function TextareaComponent({
  label = "",
  placeholder = "",
  value,
  onChange,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <InputTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full ${className}`}
        autoResize
      />
    </div>
  );
}
