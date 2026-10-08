import { clsx, ReactSpeedometer } from "@/common/imports";

export default function SpeedometerWithStats({
  overallValue = 72,
  overallLabel = "Overall Health",
  overallColor = "green",
  platforms = [
    { name: "Shopify", value: 87, color: "#FF695B" },
    { name: "Amazon", value: 57, color: "#DDD427" },
    { name: "eBay", value: 35, color: "#0CB91D" },
  ],
  gaugeOptions = {},
}) {
  const {
    width = 350,
    height = 190,
    customSegmentStops = [0, 25, 46, 90, 100],
    segmentColors = ["#FF695B", "#DDD427", "#0CB91D", "#E5E7EB"],
    ...restGaugeOptions
  } = gaugeOptions;

  const customSegmentLabels = [
    { text: "", position: "OUTSIDE", color: "#0F2418", fontSize: "10px" },
    { text: "25", position: "OUTSIDE", color: "#0F2418", fontSize: "10px" },
    { text: "50", position: "OUTSIDE", color: "#0F2418", fontSize: "10px" },
    { text: "", position: "OUTSIDE", color: "#0F2418", fontSize: "10px" },
  ];

  return (
    <div
      className="relative mx-auto pt-4 pb-6 bg-white dark:bg-transparent"
      style={{
        width: width + 40,
        height: height + 115,
        // borderRadius: "20px",
        // overflow: "hidden",
      }}
    >
      <ReactSpeedometer
        forceRender
        value={overallValue}
        width={width}
        height={height}
        maxValue={100}
        minValue={0}
        segments={customSegmentStops.length - 1}
        customSegmentStops={customSegmentStops}
        segmentColors={segmentColors}
        needleTransitionDuration={1000}
        needleTransition="easeElastic"
        currentValueText=""
        valueTextFontSize="0"
        needleColor="#000000"
        needleHeightRatio={0.3}
        ringWidth={15}
        showSegmentLabels={true}
        customSegmentLabels={customSegmentLabels}
        needleBaseColor="white"
        {...restGaugeOptions}
      />

      {/* Custom Arc-Aligned Labels */}
      <div className="absolute top-[178px] left-[8px] flex gap-[322px] text-[10px] text-[#0F2418] font-bold ">
        <span>0</span>
        {/* <span>25</span>
        <span>50</span> */}
        <span>100</span>
      </div>

      {/* Custom Tick Marks on Arc */}
      <div
        className="absolute top-[185px]"
        style={{ width: width, height: height }}
      >
        <div className="relative w-full h-full">
          {[...Array(49)].map((_, i) => {
            const angleDeg = 360 - (180 / 48) * i; // left (180°) → right (0°)
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = width / 2 - 10; // adjust as needed

            const x = radius * Math.cos(angleRad);
            const y = radius * Math.sin(angleRad);

            const rotate = angleDeg - 90; // keep ticks vertical

            return (
              <div
                key={i}
                className="absolute w-[1px] h-[8px] bg-gray-500 opacity-60"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `${y}px`,
                  transform: `translate(-0.5px, -50%) rotate(${rotate}deg)`,
                  transformOrigin: "center bottom",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Center value & label */}
      <div className="absolute top-[85px] left-[140px] text-center">
        <div
          className="font-extrabold text-[28px]"
          style={{ color: "#0CB91D" }}
        >
          {overallValue}%
        </div>
        <div className="text-gray-400 text-[13px] font-medium">
          {overallLabel}
        </div>
      </div>

      {/* Platform stats */}
      <div className="flex flex-row gap-[100px] p-0 mt-2">
        {platforms.map((p, i) => (
          <div key={i}>
            <div
              className={clsx(
                "flex items-center justify-center text-[24px] font-extrabold bg-clip-text text-transparent",
                p.name === "Shopify" &&
                  "bg-gradient-to-r from-[#0CB91D] to-[#05530D]",
                p.name === "Amazon" &&
                  "bg-gradient-to-r from-[#DDD427] to-[#8C8A0F]",
                p.name === "eBay" &&
                  "bg-gradient-to-r from-[#FF695B] to-[#B91C1C]"
              )}
            >
              {p.value}%
            </div>
            <div className="flex items-center justify-center text-[#6F7C74] text-[14px] ">
              {p.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
