import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaSnapchatGhost, FaTwitter, FaLinkedin, FaGithub, FaAmazon, FaMicrosoft, FaApple, FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
const coypIcon = "/images/task/copy.png";

// Function to get icon based on platform name
const getPlatformIcon = (name: string) => {
  const normalizedName = name.toLowerCase();
  switch (normalizedName) {
    case 'google':
      return <FcGoogle />;
    case 'facebook':
      return <FaFacebook className="text-blue-600" />;
    case 'instagram':
      return <FaInstagram className="text-pink-500" />;
    case 'snapchat':
      return <FaSnapchatGhost className="text-yellow-400" />;
    case 'twitter':
      return <FaTwitter className="text-blue-400" />;
    case 'linkedin':
      return <FaLinkedin className="text-blue-700" />;
    case 'github':
      return <FaGithub className="text-gray-800 dark:text-white" />;
    case 'amazon':
      return <FaAmazon className="text-orange-500" />;
    case 'microsoft':
      return <FaMicrosoft className="text-blue-500" />;
    case 'apple':
      return <FaApple className="text-gray-800 dark:text-white" />;
    case 'netflix':
      return <span className="text-red-600 text-2xl font-bold">N</span>;
    case 'spotify':
      return <FaSpotify className="text-green-500" />;
    default:
      return <FcGoogle />;
  }
};

const copyToClipboard = (text: string, setShowTooltip: (show: boolean) => void) => {
  navigator.clipboard.writeText(text);
  setShowTooltip(true);
  setTimeout(() => setShowTooltip(false), 2000);
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

interface SocialCardProps {
  name: string;
  icon?: React.ReactNode;
  url?: string;
  email?: string;
  password?: string;
}

const SocialCard = ({ name, icon, url: initialUrl, email: initialEmail, password: initialPassword }: SocialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(initialEmail !== undefined ? initialEmail : "Loremipsum@gmail.com");
  const [password, setPassword] = useState(initialPassword !== undefined ? initialPassword : "Dolor@12345");
  const [url, setUrl] = useState(() => {
    if (initialUrl !== undefined && initialUrl !== '') return initialUrl;
    // Generate dummy URL based on account name
    const baseUrl = name.toLowerCase().replace(/\s+/g, '');
    return `https://www.${baseUrl}.com/login`;
  });
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [showUrlTooltip, setShowUrlTooltip] = useState(false);

  // Update state when props change
  useEffect(() => {
    if (initialEmail !== undefined) setEmail(initialEmail);
    if (initialPassword !== undefined) setPassword(initialPassword);
    if (initialUrl !== undefined && initialUrl !== '') setUrl(initialUrl);
  }, [initialEmail, initialPassword, initialUrl]);

  const displayIcon = icon || getPlatformIcon(name);

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-r from-[#5D60EF]/10 to-[#BAFF86]/10 dark:from-[#5D60EF]/20 dark:to-[#BAFF86]/20 flex flex-col gap-2 w-full justify-between`}
    >
      <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold text-lg">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
          <span className="text-[30px]">{displayIcon}</span>
        </div>
        <span>{name}</span>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-2 w-full bg-white dark:bg-gray-800 rounded-[8px] px-3 py-2 border border-[#73779140]/25 dark:border-gray-600">
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            rows={1}
            className="w-full outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent resize-none"
            style={{ minHeight: '20px', maxHeight: '60px' }}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => copyToClipboard(url, setShowUrlTooltip)}
            className="mt-2 ml-2 hover:opacity-75 transition-opacity"
          >
            <img src={coypIcon} alt="copy icon" />
          </button>
          {showUrlTooltip && (
            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
              Copied!
            </div>
          )}
        </div>
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
        <div className="relative">
          <button
            onClick={() => copyToClipboard(email, setShowEmailTooltip)}
            className="mt-2 ml-2 hover:opacity-75 transition-opacity"
          >
            <img src={coypIcon} alt="copy icon" />
          </button>
          {showEmailTooltip && (
            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
              Copied!
            </div>
          )}
        </div>
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
        <div className="relative">
          <button
            onClick={() => copyToClipboard(password, setShowPasswordTooltip)}
            className="mt-2 ml-2 hover:opacity-75 transition-opacity"
          >
            <img src={coypIcon} alt="copy icon" />
          </button>
          {showPasswordTooltip && (
            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
              Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SocialAccountsProps {
  accounts?: Array<{
    name: string;
    icon?: React.ReactNode;
    url?: string;
    email?: string;
    password?: string;
  }>;
}

export default function SocialAccounts({ accounts: customAccounts }: SocialAccountsProps) {
  const allAccounts = customAccounts || accounts;
  const column1 = allAccounts.slice(0, 4);
  const column2 = allAccounts.slice(4, 8);
  const column3 = allAccounts.slice(8, 12);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 mx-auto">
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column1.map((account, index) => (
            <SocialCard key={`${account.name}-${account.email}-${index}`} {...account} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column2.map((account, index) => (
            <SocialCard key={`${account.name}-${account.email}-${index + 4}`} {...account} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
          {column3.map((account, index) => (
            <SocialCard key={`${account.name}-${account.email}-${index + 8}`} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
}
