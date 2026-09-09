import { Dropdown, useState, Icon } from "@/common/imports";

export default function FlagDropdown({
  countries = [],
  defaultCountry = null,
  onChange = () => {},
  showLabel = true, // controls field (selected value) label visibility
  size = "w-[150px]",
  iconSize = "w-5 h-5",
  iconSizeExpand = "w-4 h-4",
  styling = "",
}) {
  const getInitialSelected = () => {
    if (typeof defaultCountry === "string") {
      return countries.find((c) => c.code === defaultCountry) || countries[0];
    }
    return (
      countries.find((c) => c.code === defaultCountry?.code) || countries[0]
    );
  };

  const [selected, setSelected] = useState(getInitialSelected());

  const handleChange = (e) => {
    setSelected(e.value);
    onChange(e.value);
  };

  // Template for dropdown options (always flag + label)
  const itemTemplate = (option) => (
    <div className="flex items-center gap-2 text-[12px] dark:!text-white">
      <Icon icon={option.icon} className={`${iconSizeExpand}`} />
      <span>{option.label}</span>
    </div>
  );

  // Template for dropdown field (conditionally render label)
  const valueTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex items-center gap-2 md:pl-[5px]">
          <Icon icon={option.icon} className={`${iconSize} min-w-[1.5rem]`} />
          {showLabel && <span>{option.label}</span>}
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  return (
    <Dropdown
      value={selected}
      onChange={handleChange}
      options={countries}
      optionLabel="label"
      placeholder="Select country"
      className={`${size} ${styling}`}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      panelClassName="!rounded-xl !bg-white dark:!bg-[#1F2937]"
    />
  );
}
