import {
  Logo,
  SidebarToggle,
  ThemeToggle,
  NotificationIcon,
  FlagDropdown,
  UserProfile,
  SearchBox,
  PinIcon,
} from "@/common/imports";

const UserName = "Gul e hasnain";

export default function Topbar({ toggleSidebar }) {
  const countries = [
    { code: "us", label: "English", icon: "flagpack:gb-ukm" },
    { code: "ind", label: "Hindi", icon: "emojione-v1:flag-for-india" },
    { code: "fr", label: "French", icon: "twemoji:flag-france" },
  ];
  return (
    <div className="w-full bg-white dark:bg-[#000000] ">
      {/* XL and above: 1-row layout */}
      <div className="hidden xl:flex items-center h-[55px] w-full px-2">
        <div className="flex items-center gap-x-12">
          <Logo />
          <SidebarToggle
            toggleSidebar={toggleSidebar}
            styling="text-black dark:text-white hover:text-blue-500 focus:outline-none"
          />
        </div>

        <div className="ml-10">
          <span className="text-[#151D48] text-md dark:text-white font-bold truncate pr-10">
            Good Morning, {UserName}
          </span>
        </div>

        <div className="flex items-center ml-auto">
          <div className="ml-4">
            <SearchBox
              styling="w-96 h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
              placeholder="Search orders, tasks, inventory, and more..."
            />
          </div>

          <div className="ml-4">
            <ThemeToggle
              size="w-16 h-9"
              iconLight="/moon.png"
              iconDark="/sun.png"
              mainStyling="border-none rounded-full"
              iconSize="w-8 h-6"
            />
          </div>

          <div className="ml-5">
            <FlagDropdown
              countries={countries}
              defaultCountry="us"
              showLabel={false}
              size="w-[90px] h-9"
              iconSize="w-5 h-5"
              styling="[&_.p-dropdown-trigger-icon]:text-[#5D5FEF] !ring-0 !outline-none focus:!outline-none focus:!ring-0 border-none rounded-xl bg-[#F4F6F9] dark:bg-[#1F2937]"
              onChange={(val) => console.log("Selected:", val)}
            />
          </div>

          <div className="ml-1.5">
            <PinIcon
              icon="solar:pin-linear"
              iconStyle="text-xl text-[#5D5FEF]"
              showDot={true}
              dotStyling="bg-red-500 absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full"
              className="ml-2 bg-[#5D5FEF1A] dark:bg-[#5D5FEF40] w-9 h-9 rounded-xl flex items-center justify-center"
            />
          </div>

          <div className="ml-1.5">
            <NotificationIcon
              icon="carbon:notification"
              iconStyle="text-xl"
              showDot={true}
              dotStyling="bg-red-500 absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full"
              className="ml-2"
            />
          </div>

          <div className="ml-1">
            <UserProfile
              username="John Doe"
              view="Admin View"
              imgSrc="/profile.png"
              className="ml-4"
            />
          </div>
        </div>
      </div>

      {/* SM only: 3-row layout */}
      <div className="block md:hidden w-full">
        {/* Row 1 */}
        <div className="flex items-center justify-between h-[55px] w-full px-4 bg-white dark:bg-black rounded-t-xl relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-b after:from-black/10 after:to-transparent dark:after:from-white/10 dark:after:to-transparent">
          <SidebarToggle
            toggleSidebar={toggleSidebar}
            styling="text-black dark:text-white hover:text-blue-500 focus:outline-none"
          />
          <Logo />
          <div className="flex items-center gap-x-3">
            <NotificationIcon
              icon="carbon:notification"
              iconStyle="text-xl dark:text-white bg-[#F4F6F9] dark:bg-gray-800"
              showDot={true}
              dotStyling="bg-red-500 absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full"
              className="text-[#5D5FEF] dark:text-white bg-[#F4F6F9] dark:bg-gray-800 w-9 h-9 rounded-xl flex items-center justify-center"
            />
            <UserProfile
              username="John Doe"
              view="Admin View"
              imgSrc="/profile.png"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#ffffff] dark:bg-black">
          <span className="text-[#151D48] text-md dark:text-white font-bold truncate">
            Good Morning, {UserName}
          </span>
          <div className="flex items-center gap-x-4">
            <FlagDropdown
              countries={[
                { code: "us", label: "English", icon: "flagpack:gb-ukm" },
                {
                  code: "ind",
                  label: "Hindi",
                  icon: "emojione-v1:flag-for-india",
                },
                { code: "fr", label: "France", icon: "twemoji:flag-st-martin" },
              ]}
              defaultCountry="us"
              onChange={(c) => console.log("Selected:", c)}
              showLabel={true}
              size="w-[80px] h-9"
              iconSize="w-6 h-6"
              iconSizeExpand="w-4 h-4"
              styling="[&_.p-dropdown-trigger-icon]:text-[#5D5FEF] !ring-0 !outline-none focus:!outline-none focus:!ring-0 border-none rounded-xl bg-[#F4F6F9] dark:bg-[#1F2937]"
            />
            <ThemeToggle
              size="w-16 h-9"
              iconLight="/moon.png"
              iconDark="/sun.png"
              mainStyling="border-none rounded-full"
              iconSize="w-8 h-6"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="w-full px-4 bg-[#ffffff] dark:bg-black mb-2">
          <div className="max-w-none w-full">
            <SearchBox
              styling="w-full h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
              placeholder="Search orders, tasks, inventory, and more..."
            />
          </div>
        </div>
      </div>

      {/* MD to LG only: 2-row layout */}
      <div className="hidden md:block xl:hidden w-full">
        {/* Row 1 */}
        <div className="flex items-center justify-between h-[55px] px-4 bg-white dark:bg-black rounded-t-xl relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-b after:from-black/10 after:to-transparent dark:after:from-white/10 dark:after:to-transparent">
          <SidebarToggle
            toggleSidebar={toggleSidebar}
            styling="text-black dark:text-white hover:text-blue-500 focus:outline-none"
          />
          <Logo />
          <div className="flex items-center gap-x-3">
            <NotificationIcon
              icon="carbon:notification"
              iconStyle="text-xl dark:text-white bg-[#F4F6F9] dark:bg-gray-800"
              showDot={true}
              dotStyling="bg-red-500 absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full"
              className="text-[#5D5FEF] dark:text-white bg-[#F4F6F9] dark:bg-gray-800 w-9 h-9 rounded-xl flex items-center justify-center"
            />
            <UserProfile
              username="John Doe"
              view="Admin View"
              imgSrc="/profile.png"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-black gap-x-4">
          <span className="text-[#151D48] text-md dark:text-white font-bold truncate">
            Good Morning, {UserName}
          </span>

          <SearchBox
            styling="w-full h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
            containerClass="min-w-[250px] max-w-[350px] w-full"
            placeholder="Search orders, tasks, inventory, and more..."
          />

          <div className="flex items-center gap-x-4">
            <FlagDropdown
              countries={[
                { code: "us", label: "English", icon: "flagpack:gb-ukm" },
                {
                  code: "ind",
                  label: "Hindi",
                  icon: "emojione-v1:flag-for-india",
                },
                { code: "fr", label: "France", icon: "twemoji:flag-st-martin" },
              ]}
              defaultCountry="us"
              onChange={(c) => console.log("Selected:", c)}
              showLabel={true}
              size="w-[80px] h-9"
              iconSize="w-6 h-6"
              iconSizeExpand="w-4 h-4"
              styling="[&_.p-dropdown-trigger-icon]:text-[#5D5FEF] !ring-0 !outline-none focus:!outline-none focus:!ring-0 border-none rounded-xl bg-[#F4F6F9] dark:bg-[#1F2937]"
            />
            <ThemeToggle
              size="w-16 h-9"
              iconLight="/moon.png"
              iconDark="/sun.png"
              mainStyling="border-none rounded-full"
              iconSize="w-8 h-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
