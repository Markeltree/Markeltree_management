import React, { useState, useEffect, useRef } from "react";
import ActionButton from "@/components/ActionButton";
import FlagDropdown from "@/components/FlagDropdown";
import SettingData from "@/components/SettingData";
import { Skeleton } from "primereact/skeleton";
import { useModal } from "@/context/ModalContext";
import { useTheme } from "@/context/ThemeContext";
import {
  UserRolesPermissions,
  tabTitles,
  userRolesPermissionsData,
} from "@/components/SettingData";
import { WorkflowConfiguration } from "../components/SettingData";

function Toggle({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? "bg-[#09BF64]" : "bg-[#8E8E9C]"
      } relative inline-flex h-6 w-10 md:w-11 items-center rounded-full transition`}
    >
      <span
        className={`${
          enabled ? "translate-x-4 md:translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full transition
        bg-white dark:bg-[#0D0D0D]`}
      />
    </button>
  );
}

function UserRolesPermissionsSkeleton() {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-[#1C1C1C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Skeleton
            width="160px"
            height="22px"
            className="dark:bg-[#2C2C2CAA]"
          />{" "}
          {/* heading */}
          <Skeleton
            width="200px"
            height="14px"
            className="mt-2 dark:bg-[#2C2C2CAA]"
          />{" "}
          {/* subheading */}
        </div>

        {/* Search + Buttons */}
        <div className="flex flex-col md:flex-row gap-3 relative">
          <Skeleton
            width="250px"
            height="36px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />{" "}
          {/* SearchBox */}
          <div className="flex flex-row gap-2">
            {/* Filters button */}
            <Skeleton
              width="100px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />

            {/* Add new role */}
            <Skeleton
              width="130px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pt-1 overflow-x-auto w-full">
        <div className="w-full border border-gray-200 dark:border-[#2C2C2CAA] rounded-lg">
          {/* Table Header Skeleton */}
          <div className="flex w-full bg-gray-100 dark:bg-[#0D0D0D] p-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                width="25%"
                height="20px"
                className="mx-2 dark:bg-[#2C2C2CAA]"
              />
            ))}
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(8)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex w-full p-2 border-t border-gray-200 dark:border-[#2C2C2CAA]"
            >
              {[...Array(5)].map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  width="25%"
                  height="16px"
                  className="mx-2 dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Paginator */}
      <div className="mt-4 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            width="30px"
            height="30px"
            className="rounded-md dark:bg-[#2C2C2CAA]"
          />
        ))}
      </div>
    </div>
  );
}

function WorkflowSkeleton() {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-[#1C1C1C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Skeleton
            width="160px"
            height="22px"
            className="dark:bg-[#2C2C2CAA]"
          />{" "}
          {/* heading */}
          <Skeleton
            width="200px"
            height="14px"
            className="mt-2 dark:bg-[#2C2C2CAA]"
          />{" "}
          {/* subheading */}
        </div>

        {/* Search + Filters + Add New Workflow */}
        <div className="flex flex-col md:flex-row gap-3 relative">
          {/* Search */}
          <Skeleton
            width="250px"
            height="36px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />

          <div className="flex flex-row gap-2 w-full">
            {/* Filters button */}
            <Skeleton
              width="100px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />

            {/* Add new workflow */}
            <Skeleton
              width="150px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pt-6 overflow-x-auto w-full">
        <div className="w-full border border-gray-200 dark:border-[#2C2C2CAA] rounded-lg">
          {/* Table Header Skeleton */}
          <div className="flex w-full bg-gray-100 dark:bg-[#0D0D0D] p-2">
            <Skeleton
              width="30%"
              height="20px"
              className="mx-2 dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="60%"
              height="20px"
              className="mx-2 dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="10%"
              height="20px"
              className="mx-2 dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(8)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex w-full p-2 border-t border-gray-200 dark:border-[#2C2C2CAA]"
            >
              <Skeleton
                width="30%"
                height="16px"
                className="mx-2 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="60%"
                height="16px"
                className="mx-2 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="10%"
                height="16px"
                className="mx-2 dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Paginator */}
      <div className="mt-4 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            width="30px"
            height="30px"
            className="rounded-md dark:bg-[#2C2C2CAA]"
          />
        ))}
      </div>
    </div>
  );
}

function SystemPreferencesSkeleton() {
  return (
    <div className="flex-1 px-6 pt-4 bg-gray-50 dark:bg-[#141414] min-h-screen">
      {/* Tab Contents */}
      <div className="space-y-6">
        {/* Save/Cancel Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <Skeleton
            width="120px"
            height="40px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="120px"
            height="40px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Notification Card */}
        <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
          <Skeleton
            width="120px"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="220px"
            height="16px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton width="100%" height="1px" className="dark:bg-[#2C2C2CAA]" />

          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between pt-2">
              <div className="space-y-2">
                <Skeleton
                  width="200px"
                  height="18px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="250px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="40px"
                height="20px"
                className="rounded-full dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>

        {/* Theme Card */}
        <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
          <Skeleton
            width="80px"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="200px"
            height="16px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton width="100%" height="1px" className="dark:bg-[#2C2C2CAA]" />

          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between items-center pt-2">
              <Skeleton
                width="100px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="20px"
                height="20px"
                className="rounded-full dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>

        {/* Language & Currency Card */}
        <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
          <Skeleton
            width="180px"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="250px"
            height="16px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton width="100%" height="1px" className="dark:bg-[#2C2C2CAA]" />

          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between pt-2">
              <div className="space-y-2">
                <Skeleton
                  width="150px"
                  height="18px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="250px"
                  height="14px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="150px"
                height="35px"
                className="rounded-xl dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Setting() {
  const [isLoading, setIsLoading] = useState(true);

  const [tabLoading, setTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const pageTimerRef = useRef(null);
  const tabTimerRef = useRef(null);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("us");
  const [currencyVal, setCurrencyVal] = useState("usd");

  const { darkMode, toggleTheme } = useTheme();

  const currency = [
    { code: "usd", label: "Dollar", icon: "emojione:money-bag" },
    { code: "eur", label: "Euro", icon: "emojione:bank" },
    { code: "inr", label: "Rupee", icon: "emojione:credit-card" },
  ];

  const countries = [
    { code: "us", label: "English", icon: "flagpack:gb-ukm" },
    { code: "ind", label: "Hindi", icon: "emojione-v1:flag-for-india" },
    { code: "fr", label: "French", icon: "twemoji:flag-france" },
  ];

  const tabs = [
    "System Preferences",
    "User Roles & Permissions",
    "Workflow Configuration",
  ];

  useEffect(() => {
    setIsLoading(true);
    pageTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      pageTimerRef.current = null;
    }, 2000);

    return () => {
      if (pageTimerRef.current) clearTimeout(pageTimerRef.current);
      if (tabTimerRef.current) clearTimeout(tabTimerRef.current);
    };
  }, []);

  /* handle tab click: show skeleton for 2s for chosen tab */
  const handleTabChange = (idx) => {
    setActiveTab(idx);

    if (tabTimerRef.current) {
      clearTimeout(tabTimerRef.current);
      tabTimerRef.current = null;
    }

    setTabLoading(true);
    tabTimerRef.current = setTimeout(() => {
      setTabLoading(false);
      tabTimerRef.current = null;
    }, 2000);
  };

  // ✅ Saved Settings Snapshot
  const [savedSettings, setSavedSettings] = useState({
    emailNotif: true,
    smsNotif: true,
    inAppNotif: false,
    theme: "light",
    language: "us",
    currency: "usd",
  });

  // ✅ Save Handler
  const handleSave = () => {
    setSavedSettings({
      emailNotif,
      smsNotif,
      inAppNotif,
      theme,
      language,
      currency: currencyVal,
    });

    // ✅ Apply theme only when saving
    if (theme === "dark" && !darkMode) toggleTheme();
    if (theme === "light" && darkMode) toggleTheme();

    console.log("✅ Settings Saved:", {
      emailNotif,
      smsNotif,
      inAppNotif,
      theme,
      language,
      currency: currencyVal,
    });
  };

  // ✅ Cancel Handler (Revert to last saved)
  const handleCancel = () => {
    setEmailNotif(savedSettings.emailNotif);
    setSmsNotif(savedSettings.smsNotif);
    setInAppNotif(savedSettings.inAppNotif);
    setTheme(savedSettings.theme);
    setLanguage(savedSettings.language);
    setCurrencyVal(savedSettings.currency);

    console.log("❌ Changes Reverted");
  };

  if (isLoading) {
    return (
      <>
        <div className="flex-1 px-6 pt-4 bg-gray-50 dark:bg-[#141414] min-h-screen">
          {/* Header */}
          <div className="flex flex-row justify-between items-center mb-6 gap-2">
            <Skeleton
              width="100px"
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                width="150px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
            ))}
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 mb-6">
              <Skeleton
                width="120px"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="120px"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>

            {/* Notification Card */}
            <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
              <Skeleton
                width="120px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="220px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="1px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between pt-2">
                  <div className="space-y-2">
                    <Skeleton
                      width="200px"
                      height="18px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="250px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <Skeleton
                    width="40px"
                    height="20px"
                    className="rounded-full dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
            </div>

            {/* Theme Card */}
            <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
              <Skeleton
                width="80px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="200px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="1px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between items-center pt-2">
                  <Skeleton
                    width="100px"
                    height="16px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                  <Skeleton
                    width="20px"
                    height="20px"
                    className="rounded-full dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
            </div>

            {/* Language & Currency Card */}
            <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
              <Skeleton
                width="180px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="250px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="1px"
                className="dark:bg-[#2C2C2CAA]"
              />

              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between pt-2">
                  <div className="space-y-2">
                    <Skeleton
                      width="150px"
                      height="18px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                    <Skeleton
                      width="250px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <Skeleton
                    width="150px"
                    height="35px"
                    className="rounded-xl dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 px-6 pt-4 bg-gray-50 dark:bg-[#141414] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-6 gap-2">
        <h1 className="text-[14px] font-medium text-[#09BF64] dark:text-[#81D959] whitespace-nowrap">
          Setting
        </h1>
      </div>
      {/* Tabs */}
      <div className="flex gap-8 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`pb-2 text-sm ${
              activeTab === idx
                ? "text-[#0F2418] dark:text-[#EFFBF3] font-medium border-b-2 border-[#09BF64]"
                : "text-[#0F2418] dark:text-[#B5E6C9] opacity-70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Contents */}
      {tabLoading ? (
        // show skeleton for the currently active tab
        activeTab === 0 ? (
          <SystemPreferencesSkeleton />
        ) : activeTab === 1 ? (
          <UserRolesPermissionsSkeleton />
        ) : (
          <WorkflowSkeleton />
        )
      ) : (
        <>
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* Save/Cancel Buttons */}
              <div className="flex justify-end gap-4 mb-6">
                <ActionButton
                  label="Cancel"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="w-[120px] py-2 rounded-lg border border-[#09BF64] text-[#09BF64] bg-transparent hover:bg-[#09BF64]/10 font-normal focus:outline-none focus:ring-0"
                  onClick={handleCancel}
                />
                <ActionButton
                  label="Save"
                  labelClass="font-normal text-[12px] md:text-[16px]"
                  buttonClass="w-[120px] py-2 rounded-lg bg-[#09BF64] text-[#FFFFFF] dark:text-[#111111] hover:bg-[#4a4ccf] font-normal focus:outline-none focus:ring-0"
                  onClick={handleSave}
                />
              </div>
              {/* Notification */}
              <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
                <h2 className="font-semibold text-[14px] md:text-[18px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                  Notification
                </h2>
                <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                  Customize how you stay informed and connected
                </p>
                <hr className="border-gray-200 dark:border-[#A9A9A9]" />
                {/* Email */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium text-[13px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      Get Notification by Email
                    </p>
                    <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                      Get every update of your bets and account via email.
                    </p>
                  </div>
                  <Toggle enabled={emailNotif} setEnabled={setEmailNotif} />
                </div>
                {/* SMS */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[13px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      SMS Notification
                    </p>
                    <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                      Get every update of your bets and account via SMS.
                    </p>
                  </div>
                  <Toggle enabled={smsNotif} setEnabled={setSmsNotif} />
                </div>
                {/* In App */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[13px] md:text-[16px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                      In App Notification
                    </p>
                    <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                      Get every update of your bets and account in system.
                    </p>
                  </div>
                  <Toggle enabled={inAppNotif} setEnabled={setInAppNotif} />
                </div>
              </div>
              {/* Theme */}
              <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
                <h2 className="font-semibold text-[14px] md:text-[18px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                  Theme
                </h2>
                <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                  Customize how the system looks and feels.
                </p>
                <hr className="border-gray-200 dark:border-[#A9A9A9]" />
                <div className="flex flex-col gap-3 pt-2">
                  {["light", "dark"].map((opt) => (
                    <label
                      key={opt}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-[#2B2B2B] text-[11px] md:text-[14px] dark:text-[#EFFBF3] capitalize">
                        {opt} Theme
                      </span>
                      <input
                        type="radio"
                        name="theme"
                        value={opt}
                        checked={theme === opt}
                        onChange={() => setTheme(opt)} // ✅ only update local state
                        className="h-5 w-5 text-[#81D959] focus:ring-[#81D959] border-[#81D959] accent-[#09BF64]"
                      />
                    </label>
                  ))}
                </div>
              </div>
              {/* Language & Currency */}
              <div className="bg-white dark:bg-black shadow-sm rounded-xl p-6 space-y-4 border border-gray-200 dark:border-none">
                <h2 className="font-semibold text-[14px] md:text-[18px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                  Language & Currency
                </h2>
                <p className="text-[11px] md:text-[14px] text-[#8E8E9C]">
                  Set your preferred language & currency.
                </p>
                <hr className="border-gray-200 dark:border-[#A9A9A9]" />
                <div className="flex flex-col gap-6 pt-2">
                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[2B2B2B] dark:text-[#EFFBF3] text-[13px] md:text-[16px]">
                        Language
                      </p>
                      <p className="text-[11px] md:text-[14px]  text-[#8E8E9C]">
                        Set your preferred language to match your regional
                        preferences.
                      </p>
                    </div>
                    <FlagDropdown
                      countries={countries}
                      defaultCountry={language}
                      showLabel={true}
                      size="w-[150px]"
                      styling="[&_.p-dropdown-trigger-icon]:text-[#09BF64] !ring-0 !outline-none focus:!outline-none focus:!ring-0 border-none rounded-xl bg-[#F4F6F9] dark:bg-[#1F2937]"
                      onChange={(val) => setLanguage(val)}
                    />
                  </div>
                  {/* Currency */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[2B2B2B] dark:text-[#EFFBF3] text-[13px] md:text-[16px]">
                        Currency
                      </p>
                      <p className="text-[11px] md:text-[14px]  text-[#8E8E9C]">
                        Choose your default currency for accurate financial
                        transactions.
                      </p>
                    </div>
                    <FlagDropdown
                      countries={currency}
                      defaultCountry={currencyVal}
                      showLabel={true}
                      size="w-[150px]"
                      styling="[&_.p-dropdown-trigger-icon]:text-[#09BF64] !ring-0 !outline-none focus:!outline-none focus:!ring-0 border-none rounded-xl bg-[#F4F6F9] dark:bg-[#1F2937]"
                      onChange={(val) => setCurrencyVal(val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && <UserRolesPermissions />}
          {activeTab === 2 && <WorkflowConfiguration />}
          <div className="pb-5"></div>
        </>
      )}
    </div>
  );
}
