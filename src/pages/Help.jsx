import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "primereact/skeleton";

/* Chevron Icons */
const ChevronRight = ({ size = 20, color = "#5D5FEF" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const ChevronDown = ({ size = 20, color = "#A7AEDB", open }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${open ? "rotate-180" : ""} transition-transform`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function Help() {
  const categories = [
    {
      name: "Login Issues",
      faqs: [
        {
          q: "How do I reset my password?",
          a: [
            "Go to Settings > Security.",
            'Click "Reset Password" and enter your email.',
            "Follow the instructions in the email to set a new password.",
          ],
        },
        {
          q: "How can I update my billing details?",
          a: ["Go to Account Settings > Billing to update your details."],
        },
        {
          q: "What should I do if my order is delayed?",
          a: [
            "Check order status under My Orders or contact support with your order ID.",
          ],
        },
        {
          q: "How do I enable Two-Factor Authentication (2FA)?",
          a: ["Open Account Settings > Security and switch on 2FA."],
        },
        {
          q: "How do I generate an invoice for my purchase?",
          a: ["Open Order History and click Download Invoice on the order."],
        },
        {
          q: "Can I change the default currency in my account?",
          a: ["Yes. Go to Preferences > Currency and choose your default."],
        },
      ],
    },
    {
      name: "Products",
      faqs: [
        {
          q: "How can I search for products?",
          a: ["Use the top search bar or browse by category from the catalog."],
        },
        {
          q: "Can I compare multiple products?",
          a: [
            "On a product card, click Compare, then open the Compare drawer.",
          ],
        },
      ],
    },
    {
      name: "Inventory",
      faqs: [
        {
          q: "How do I check stock availability?",
          a: ["Stock appears on product pages and in the inventory dashboard."],
        },
        {
          q: "Can I get restock alerts?",
          a: ["Click Notify Me on the product page to receive an email alert."],
        },
      ],
    },
    {
      name: "Order Management",
      faqs: [
        {
          q: "How do I cancel my order?",
          a: ["Go to My Orders. If the order isn’t packed yet, click Cancel."],
        },
        {
          q: "How do I track my shipment?",
          a: [
            "Tracking details are included in your order email and order details page.",
          ],
        },
      ],
    },
    {
      name: "Accounts",
      faqs: [
        {
          q: "How do I change my email address?",
          a: ["Go to Account Settings > Profile and update your email."],
        },
        {
          q: "Can I delete my account?",
          a: ["Submit a deletion request from Account Settings > Privacy."],
        },
      ],
    },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const timerRef = useRef(null);

  // initial mount effect -> full-page skeleton
  useEffect(() => {
    // show full page skeleton for initial load
    setIsInitialLoad(true);
    setIsLoading(false);

    timerRef.current = setTimeout(() => {
      setIsInitialLoad(false);
      // ensure first FAQ is expanded for the active category after initial load
      setOpenPerCat((prev) => ({ ...prev, [0]: 0 }));
      timerRef.current = null;
    }, 2000); // keep your original 2000ms if you prefer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // run only on mount
  }, []);

  const [activeCat, setActiveCat] = useState(0);
  const [openPerCat, setOpenPerCat] = useState({ 0: 0 });

  const onToggle = (i) =>
    setOpenPerCat((prev) => ({
      ...prev,
      [activeCat]: prev[activeCat] === i ? null : i,
    }));

  // ----- handle left category clicks (show skeleton while switching) -----
  const handleCategorySelect = (i) => {
    if (i === activeCat) return; // no-op if same category

    // clear any pending timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Immediately switch left panel highlight
    setActiveCat(i);

    // Show right-panel skeleton while we "load"
    setIsLoading(true);

    // Simulate load; after finished expand first item in that category
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setOpenPerCat((prev) => ({ ...prev, [i]: 0 }));
      timerRef.current = null;
    }, 2000);
  };

  const cat = categories[activeCat];

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#141414]">
        <div className="px-4 pt-5 max-w-6xl mx-auto">
          <div className="mb-3">
            <Skeleton
              width="140px"
              height="18px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="mb-6 text-center">
            <Skeleton
              width="360px"
              height="40px"
              className="mx-auto dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 mb-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="bg-white dark:bg-[#0D0D0D] rounded-xl shadow-sm p-4 space-y-3">
              {[...Array(6)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  width="100%"
                  height="44px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>
          </aside>

          <section className="md:col-span-8 lg:col-span-9">
            <div className="bg-white dark:bg-[#0D0D0D] rounded-xl shadow-sm p-6 space-y-4">
              <Skeleton
                width="100%"
                height="56px"
                className="rounded-md dark:bg-[#2C2C2CAA]"
              />
              {[...Array(5)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  width="100%"
                  height="48px"
                  className="rounded-md dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F6F8FB] dark:bg-[#141414]">
        {/* Top link */}
        <div className="px-4 pt-5">
          <span className="text-[#5D5FEF] text-sm font-medium">Help</span>
        </div>

        {/* Title */}
        <h1 className="text-center text-[32px] font-semibold text-[#151D48] dark:text-[#F2F2FE] mt-4">
          Help Center
        </h1>

        {/* Equal height layout */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch h-[calc(100vh-240px)]">
          {/* LEFT PANEL */}
          <aside className="md:col-span-4 lg:col-span-3 flex flex-col">
            <div className="flex-1 h-full bg-white dark:bg-[#0D0D0D] rounded-xl shadow-sm p-3 md:p-4 flex flex-col">
              <ul className="space-y-3 flex-1">
                {categories.map((c, i) => {
                  const active = i === activeCat;
                  const isDarkMode =
                    document.documentElement.classList.contains("dark");
                  return (
                    <li key={c.name}>
                      <button
                        onClick={() => handleCategorySelect(i)}
                        className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition
                        ${
                          active
                            ? "bg-[#EEF1FF] dark:bg-transparent text-[#5D5FEF] dark:text-[#FFFFFF] font-normal"
                            : "text-[#6B7280] dark:text-[#737791] hover:bg-gray-50 dark:hover:bg-[#1A1A1A]"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {active && (
                          <ChevronRight
                            size={24}
                            color={isDarkMode ? "#FFFFFF" : "#5D5FEF"}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="md:col-span-8 lg:col-span-9 flex flex-col">
            <div className="flex-1 h-full bg-white dark:bg-[#0D0D0D] rounded-xl shadow-sm p-4 md:p-6 flex flex-col">
              {/* If loading (from category switch) → show skeleton on the right */}
              {isLoading ? (
                <div className="space-y-3 flex-1">
                  {/* First entry: expanded skeleton (question + 3 answer lines) */}
                  <div>
                    <Skeleton
                      width="100%"
                      height="56px"
                      className="dark:bg-[#2C2C2CAA] rounded-md"
                    />
                    <div className="px-11 md:px-12 pt-4">
                      <Skeleton
                        width="90%"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA] mb-2"
                      />
                      <Skeleton
                        width="85%"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA] mb-2"
                      />
                      <Skeleton
                        width="80%"
                        height="12px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </div>
                  </div>

                  {/* Other collapsed questions as skeleton rows */}
                  {Array.from({ length: cat.faqs.length - 1 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      width="100%"
                      height="48px"
                      className="dark:bg-[#2C2C2CAA] rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 flex-1">
                  {cat.faqs.map((item, i) => {
                    const open = openPerCat[activeCat] === i;
                    return (
                      <div key={i}>
                        <button
                          onClick={() => onToggle(i)}
                          className={`w-full flex items-center justify-between rounded-md px-3 md:px-4 py-3 text-left
                        ${
                          open
                            ? "bg-[#F3F5FF] dark:bg-[#1A1A1A] border border-[#E9ECFF] dark:border-[#2D2D2D]"
                            : ""
                        }`}
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            {/* Circle color changes */}
                            <span
                              className={`mt-1 w-4 h-4 rounded-full inline-block ${
                                open ? "bg-[#5D5FEF]" : "bg-[#A5A6F6]"
                              }`}
                            ></span>
                            <span
                              className={`text-[15px] font-normal ${
                                open
                                  ? "text-[#151D48] dark:text-[#FFFFFF]"
                                  : "text-[#1F2937] dark:text-[#FFFFFF]"
                              }`}
                            >
                              {item.q}
                            </span>
                          </div>
                          <ChevronDown
                            size={24}
                            color={open ? "#5D5FEF" : "#A7AEDB"}
                            open={open}
                          />
                        </button>

                        {open && (
                          <div className="px-11 md:px-12 pb-4">
                            <ul className="list-disc pl-6 text-[14px] leading-6 text-[#6F7DAC] dark:text-[#737791] space-y-1">
                              {item.a.map((line, idx) => (
                                <li key={idx}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
          <div className="pb-5"></div>
        </div>
        <div className="pb-5"></div>
      </div>
    </>
  );
}
