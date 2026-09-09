import { Button, useTheme } from "@/common/imports";

export default function ActionButton({
  label = "Click Me",
  iconLight = null,
  iconDark = null,
  iconPos = "left",
  iconClass = "w-4 h-4 object-contain transition-all duration-300 ease-in-out",
  onClick = null,
  buttonClass = "p-button-sm p-button-outlined",
  labelClass = "",
}) {
  const { darkMode } = useTheme();
  const icon = darkMode ? iconDark : iconLight;

  return (
    <Button
      label={label}
      onClick={onClick}
      className={`transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)] ${buttonClass}`}
      pt={{
        label: { className: labelClass },
        root: { className: buttonClass },
      }}
      icon={() =>
        typeof icon === "string" ? (
          <img src={icon} alt="icon" className={iconClass} />
        ) : (
          icon
        )
      }
      iconPos={iconPos}
    />
  );
}
