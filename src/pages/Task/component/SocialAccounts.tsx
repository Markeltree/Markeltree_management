import { useState } from "react";
import { FaFacebook, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import coypIcon from "../../../../public/images/task/copy.png";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const accounts = [
  { name: "Google", icon: <FcGoogle />, color: "from-green-50 to-green-100" },
  {
    name: "Facebook",
    icon: <FaFacebook className="text-blue-600" />,
    color: "from-blue-50 to-blue-100",
  },
  {
    name: "Snapchat",
    icon: <FaSnapchatGhost className="text-yellow-400" />,
    color: "from-yellow-50 to-yellow-100",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
    color: "from-pink-50 to-pink-100",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
    color: "from-pink-50 to-pink-100",
  },
  {
    name: "Facebook",
    icon: <FaFacebook className="text-blue-600" />,
    color: "from-blue-50 to-blue-100",
  },
  {
    name: "Snapchat",
    icon: <FaSnapchatGhost className="text-yellow-400" />,
    color: "from-yellow-50 to-yellow-100",
  },
  { name: "Google", icon: <FcGoogle />, },
  { name: "Google", icon: <FcGoogle />, },
  {
    name: "Facebook",
    icon: <FaFacebook className="text-blue-600" />,
    color: "from-blue-50 to-blue-100",
  },
  {
    name: "Snapchat",
    icon: <FaSnapchatGhost className="text-yellow-400" />,
    color: "from-yellow-50 to-yellow-100",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
    color: "from-pink-50 to-pink-100",
  },
];

const SocialCard = ({ name, icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("Loremipsum@gmail.com");
  const [password, setPassword] = useState("Dolor@12345");

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-r from-[#5D60EF]/10 to-[#BAFF86]/10 dark:from-[#5D60EF]/20 dark:to-[#BAFF86]/20 flex flex-col gap-2 w-full justify-between`}
    >
      <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold text-lg">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
          <span className="text-[30px]">{icon}</span>
        </div>
        <span>{name}</span>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-2 w-full bg-white dark:bg-gray-800 rounded-[8px] px-3 py-2 border border-[#73779140]/25 dark:border-gray-600">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent"
          />
        </div>
        <button
          onClick={() => copyToClipboard(email)}
          className="mt-2 ml-2 hover:opacity-75 transition-opacity"
        >
          <img src={coypIcon} alt="copy icon" />
        </button>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-[8px] px-3 py-2 border border-[#73779140]/25 dark:border-gray-600 w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <button
          onClick={() => copyToClipboard(password)}
          className="mt-2 ml-2 hover:opacity-75 transition-opacity"
        >
          <img src={coypIcon} alt="copy icon" />
        </button>
      </div>
    </div>
  );
};

export default function SocialAccounts() {
  const column1 = accounts.slice(0, 4);
  const column2 = accounts.slice(4, 8);
  const column3 = accounts.slice(8, 12);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 mx-auto">
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column1.map((account, index) => (
            <SocialCard key={index} {...account} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column2.map((account, index) => (
            <SocialCard key={index + 4} {...account} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column3.map((account, index) => (
            <SocialCard key={index + 8} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
}
