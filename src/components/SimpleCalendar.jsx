import { addLocale } from "primereact/api";
import { useState, useRef, useEffect, Calendar, Icon } from "@/common/imports";

addLocale("custom", {
  firstDayOfWeek: 0,
  dayNames: [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ],
  dayNamesShort: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  dayNamesMin: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  today: "Today",
  clear: "Clear",
});

export default function SimpleCalendar({
  value = new Date(),
  onChange,
  className = "",
}) {
  const [selectedDate, setSelectedDate] = useState(value);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      const rect = selectedRef.current.getBoundingClientRect();
      const containerRect =
        selectedRef.current.offsetParent?.getBoundingClientRect();
      if (containerRect) {
        setPosition({
          top: rect.top - containerRect.top - 35,
          left: rect.left - containerRect.left + rect.width / 2,
        });
      }
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    setSelectedDate(e.value);
    onChange?.(e.value);
  };

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div
      className={`flex-grow overflow-hidden relative bg-[#F9FAFB] dark:bg-[#121212] text-[#252733] dark:text-white ${className}`}
    >
      <Calendar
        value={selectedDate}
        onChange={handleChange}
        locale="custom"
        inline
        style={{
          height: "100%",
          border: "none",
          boxShadow: "none",
          outline: "none",
        }}
        className="!w-full !h-full !p-0 !m-0 calendar-no-border"
        panelClassName="custom-calendar-panel"
        dateTemplate={(date) => {
          const current = new Date(date.year, date.month, date.day);
          const selected = selectedDate
            ? isSameDate(current, selectedDate)
            : false;

          return (
            <div
              className="relative flex justify-center items-center w-[30px] h-[30px]"
              ref={selected ? selectedRef : null}
            >
              <span
                className={`w-[28px] h-[28px] flex items-center justify-center text-[12px] rounded-full ${
                  selected ? "bg-[#09BF64] text-white dark:text-black" : ""
                }`}
              >
                {date.day}
              </span>
            </div>
          );
        }}
        prevIcon={
          <div className="w-6 h-6 bg-[#09BF64] rounded-full flex items-center justify-center">
            <Icon
              icon="ep:arrow-left"
              className="text-white dark:text-black"
              width={12}
              height={12}
            />
          </div>
        }
        nextIcon={
          <div className="w-6 h-6 bg-[#09BF64] rounded-full flex items-center justify-center">
            <Icon
              icon="ep:arrow-right"
              className="text-white dark:text-black"
              width={12}
              height={12}
            />
          </div>
        }
      />

      <style>
        {`
        /* Remove focus styles for inline calendar */
        .p-calendar.calendar-no-border {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* If using dark mode, add optional theme support */
        .dark .p-calendar.calendar-no-border {
          border: none !important;
          background-color: transparent !important;
        }

        /* This targets the outer container of the inline calendar */
        .p-calendar.calendar-no-border.p-calendar-inline {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          
        }

        .custom-calendar-panel.p-datepicker {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .custom-calendar-panel .p-datepicker-group-container,
        .custom-calendar-panel .p-datepicker-group {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }

        .custom-calendar-panel .p-datepicker-calendar-container {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }

        .custom-calendar-panel .p-datepicker-calendar {
          flex: 1 1 auto;
          width: 100%;
          table-layout: fixed;
          height: 100%;
          border-collapse: collapse;
        }

        .p-datepicker-calendar thead {
          flex: none;
        }

        .p-datepicker-calendar thead th {
          font-weight: 800 !important; 
          font-size: 12px !important;  
          color: inherit;              
          padding: 4px 0 !important;  
        }

        .p-datepicker-calendar td {
          padding: 0 !important;
          text-align: center;
          height: auto;
        }

        .p-datepicker-calendar td > span {
          width: 100%;
          height: 100%;
          display: flex;
          background: none !important;
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
          filter: none !important;
          align-items: center;
          justify-content: center;
        }

        .p-datepicker-calendar tbody tr {
          height: calc(100% / 6); /* Always divide space into 6 rows to handle all months */
        }

        .p-datepicker .p-datepicker-title {
          font-weight: bold;
          font-size: 15px;
          flex-grow: 1;
          text-align: left;
        }

        .p-datepicker .p-datepicker-prev,
        .p-datepicker .p-datepicker-next {
          position: static !important;
          margin-left: 6px;
        }

        .p-datepicker .p-datepicker-prev {
          order: 2;
        }

        .p-datepicker .p-datepicker-next {
          order: 3;
        }

        .dark .p-datepicker {
          background-color: black;
          color: #EFFBF3;
        }

        .dark .p-datepicker .p-datepicker-header {
          background-color: black;
          color: #EFFBF3;
        }
      
        `}
      </style>
    </div>
  );
}
