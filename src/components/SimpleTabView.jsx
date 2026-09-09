import React, { useState } from "react";

export default function SimpleTabView({
  tabs = [],
  renderItem,
  activeIndex: controlledIndex, // optional controlled prop
  onTabChange,
  defaultActiveIndex = 0, // fallback if not controlled
  tabLabelClass = "",
  activeTabClass = "",
  inactiveTabClass = "",
  tabHeaderClass = "",
  contentContainerClass = "",
  panelClass = "",
}) {
  const [uncontrolledIndex, setUncontrolledIndex] =
    useState(defaultActiveIndex);

  const activeIndex =
    controlledIndex !== undefined ? controlledIndex : uncontrolledIndex;

  const handleTabClick = (index) => {
    if (controlledIndex === undefined) {
      setUncontrolledIndex(index);
    }
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className={`flex ${tabHeaderClass}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`focus:outline-none pb-1 ${
              index === activeIndex ? activeTabClass : inactiveTabClass
            } ${tabLabelClass}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel content */}
      <div className={`${contentContainerClass}`}>
        <div className={`${panelClass}`}>
          {tabs[activeIndex]?.contentData?.map((item, idx) => (
            <div key={idx}>{renderItem(item)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
