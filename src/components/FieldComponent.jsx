import { InputText, InputNumber, Password } from "@/common/imports";

export default function FieldComponent({
  type = "text",
  label = "",
  placeholder = "",
  value,
  onChange,
  name,
  inputClass = "",
  labelClass = "",
  containerClass = "",
  rightIcon = null,
  ...rest
}) {
  const renderField = () => {
    const sharedProps = {
      name,
      placeholder,
      value,
      onChange,
      ...rest,
    };

    // Only wrap InputText when rightIcon is provided
    if ((type === "text" || type === "phone") && rightIcon) {
      return (
        <div className="relative">
          <InputText
            {...sharedProps}
            keyfilter={type === "phone" ? "pint" : undefined}
            maxLength={type === "phone" ? 15 : undefined}
            className={`${inputClass} pr-10`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {rightIcon}
          </div>
        </div>
      );
    }

    switch (type) {
      case "password":
        return (
          <Password
            {...sharedProps}
            toggleMask
            feedback={false}
            inputClassName={inputClass}
          />
        );

      case "number":
        return (
          <InputNumber
            {...sharedProps}
            onValueChange={onChange}
            useGrouping={false}
            inputClassName={inputClass}
          />
        );

      case "phone":
        return (
          <InputText
            {...sharedProps}
            keyfilter="pint"
            maxLength={15}
            className={inputClass}
          />
        );

      case "text":
      default:
        return <InputText {...sharedProps} className={inputClass} />;
    }
  };

  return (
    <div className={containerClass}>
      {label && <label className={labelClass}>{label}</label>}
      {renderField()}
    </div>
  );
}
