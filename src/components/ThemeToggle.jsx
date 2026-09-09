import { InputSwitch, useTheme } from "@/common/imports";

export default function ThemeToggle({
  iconLight = "/moon.png",
  iconDark = "/sun.png",
  size = "w-12 h-6",
  iconSize = "w-4 h-4",
  mainStyling = "",
}) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className={`relative ${size} ${mainStyling}`}>
      <style>
        {`
          .p-inputswitch.p-highlight .p-inputswitch-slider {
            background-color: #1F2937 !important; 
            }
        
          .p-inputswitch .p-inputswitch-slider {
            background-color: #F4F6F9 !important;
            }

          .dark .p-inputswitch .p-inputswitch-slider:before {
            background-color: #000000 !important;
            }

           .p-inputswitch .p-inputswitch-slider::before {
            width: 30px !important;
            height: 30px !important;
            top:35% !important;
            }

            .p-inputswitch.p-highlight .p-inputswitch-slider::before {
            transform: translateX(1.75rem);
}

        `}
      </style>
      <InputSwitch
        checked={darkMode}
        onChange={toggleTheme}
        className={`w-full h-full`}
      />

      <div
        className={`absolute top-[6px] left-[1.5px] transition-transform duration-300 ease-in-out
          ${darkMode ? "translate-x-[32px] top-[6px]" : "translate-x-[2px]"}
        `}
      >
        <img
          src={darkMode ? iconLight : iconDark}
          alt="theme-icon"
          className={`object-contain pointer-events-none ${iconSize}`}
        />
      </div>
    </div>
  );
}
