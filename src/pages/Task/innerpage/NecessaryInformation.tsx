import React from "react";
import HeadingTwo from "../component/HeadingTwo";
import SearchInput from "../component/SearchInput";
import SocialAccounts from "../component/SocialAccounts";

const NecessaryInformation = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-white dark:bg-[#0D0D0D] rounded-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <HeadingTwo text="My Passwords" className="text-[#333333]" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SearchInput />
          </div>
        </div>
        <div>
          <SocialAccounts />
        </div>
      </div>
    </>
  );
};

export default NecessaryInformation;
