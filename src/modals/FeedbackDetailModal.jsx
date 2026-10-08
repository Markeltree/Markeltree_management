import { useModal } from "@/context/ModalContext";
import {
  ActionButton,
  useState,
  useEffect,
  Skeleton,
  FlexibleCard,
} from "@/common/imports";

const feedbackDetails = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    issueDate: "12/02/2025",
    Email: "exmaple@gmail.com",
    image: "/profile.png",
  },
];

const feedbackMsg = [
  {
    id: 1,
    msgType: "Issue Type",
    msg: "Bug Report",
  },
  {
    id: 2,
    msgType: "Subject",
    msg: "Issue with login page",
  },
  {
    id: 3,
    msgType: "Description",
    msg: "The login page is not loading properly.",
  },
];

export default function FeedbackDetailModal({ closeModal }) {
  const [isLoading, setLoading] = useState(true);

  const { openModal, closeModal: closeFeedbackDetailModal } = useModal();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Title */}
        <Skeleton width="160px" height="20px" className="dark:bg-[#2C2C2CAA]" />

        {/* row 1 – Feedback details */}
        {[...Array(1)].map((_, i) => (
          <div key={i} className="relative flex w-full items-center">
            <div className="flex items-center gap-4">
              <Skeleton
                shape="circle"
                width="40px"
                height="40px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <div className="flex flex-col gap-1">
                <Skeleton
                  width="100px"
                  height="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="10px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto text-right gap-1">
              <Skeleton
                width="120px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="150px"
                height="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        ))}

        {/* row 2 – Messages */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="w-full h-auto bg-[#EEF8FD80] dark:bg-[#14141480] border-none rounded-xl p-4 flex flex-col gap-3"
          >
            <Skeleton
              width="80px"
              height="13px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100%"
              height="15px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        ))}

        {/* row 3 – Buttons */}
        <div className="flex flex-row w-full gap-2">
          <Skeleton
            width="100%"
            height="50px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="100%"
            height="50px"
            className="rounded-lg dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h1 className="text-[18px] text-[#0B1B33] dark:text-[#B5DEF2] font-bold">
        Feedback Details
      </h1>
      {/* row 1 */}
      {feedbackDetails.map((details) => (
        <div key={details.id} className="relative flex w-full items-center">
          <div className="flex items-center gap-4">
            <img
              src={details.image}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] text-[#0B1B33] dark:text-[#EEF8FD]">
                {details.name}
              </h3>
              <h3 className="text-[10px] text-[#00000066] dark:text-[#FFFFFF66]">
                {details.role}
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-1items-center ml-auto text-right">
            <h1 className="text-[12px] text-[#2B2B2B] dark:text-[#EEF8FD]">
              <span className="text-[12px] text-[#8E8E9C]">Issue Date: </span>
              {details.issueDate}
            </h1>
            <h1 className="text-[12px] text-[#2B2B2B] dark:text-[#EEF8FD]">
              <span className="text-[12px] text-[#8E8E9C]">Email: </span>
              {details.Email}
            </h1>
          </div>
        </div>
      ))}

      {/* row 2 */}
      {feedbackMsg.map((msg) => (
        <FlexibleCard
          key={msg.id}
          cardClass="w-full h-auto bg-[#EEF8FD80] dark:bg-[#14141480] border-none rounded-xl p-4"
          headerClass=""
          centerClass=""
          footerClass="flex flex-row items-center"
          header={
            <div className="relative flex w-full items-center">
              <div className="flex flex-col gap-3 text-left">
                <h3 className="text-[13px] text-[#6E7A86] dark:text-[#A9BACB]">
                  {msg.msgType}
                </h3>

                <h3 className="text-[15px] text-[#2B2B2B] dark:text-[#EEF8FD] font-medium">
                  {msg.msg}
                </h3>
              </div>
            </div>
          }
        />
      ))}

      {/* row 3 */}
      <div className="flex flex-row w-full gap-4">
        <div className="w-full gap-1">
          <ActionButton
            label="Cancel"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={closeModal}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Mark as Resolved"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}
