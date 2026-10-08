import React, { useState } from "react";
import HeadingTwo from "../component/HeadingTwo";
import SearchInput from "../component/SearchInput";
import SocialAccounts from "../component/SocialAccounts";
import ColorFull from "../../../new-components/ui/button/ColorFull";
import { FiPlus } from "react-icons/fi";
import { useModal } from "../../../context/ModalContext";
import AddNecessaryInformationModal from "../component/AddNecessaryInformationModal";
import { FaFacebook, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import ActionButton from "../../../components/ActionButton";
import { Icon } from "../../../common/imports";


const initialAccounts = [
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

type AccountType = {
  name: string;
  icon?: React.ReactNode;
  color?: string;
  url?: string;
  email?: string;
  password?: string;
};

const NecessaryInformation = () => {
  const [accounts, setAccounts] = useState<AccountType[]>(initialAccounts);
  const modalContext = useModal();
  
  // Ensure openModal is available
  if (!modalContext || !modalContext.openModal) {
    console.error("ModalContext is not available. Component must be wrapped in ModalProvider.");
  }
  
  const openModal = modalContext?.openModal;

  const handleAddInformation = (data: { platform: string; url: string; email: string; password: string }) => {
    const newAccount: AccountType = {
      name: data.platform,
      url: data.url,
      email: data.email,
      password: data.password,
    };
    // Add to the beginning of the accounts array (first column, top)
    setAccounts(prev => [newAccount, ...prev]);
  };

  const AddInformationModalWrapper = ({ closeModal }: { closeModal: () => void }) => (
    <AddNecessaryInformationModal closeModal={closeModal} onAdd={handleAddInformation} />
  );

  return (
    <>
      <div className="flex flex-col gap-4 bg-white dark:bg-[#0D0D0D] rounded-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <HeadingTwo text="My Passwords" className="text-[#333333]" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SearchInput />
            <button
              type="button"
              onClick={(e) => {
                e?.preventDefault?.();
                e?.stopPropagation?.();
                e?.currentTarget?.blur?.();
                if (openModal && typeof openModal === 'function') {
                  openModal(AddInformationModalWrapper, {
                    sizeClass: "w-[85%] md:w-[50%]",
                  });
                } else {
                  console.error("Modal context is not available. Make sure ModalProvider wraps the component.");
                }
              }}
              className="flex items-center justify-center px-3 gap-1 font-normal text-[12px] h-[35px] w-[200px] text-white bg-[#0088D1] dark:text-black border-none focus:outline-none focus:ring-0 rounded-lg hover:bg-[#4a4cd1] transition-colors"
            >
              <Icon icon="ic:round-add" width="20" height="20" />
              <span>Add Information</span>
            </button>
            
          </div>
        </div>
        <div>
          <SocialAccounts accounts={accounts} />
        </div>
      </div>
    </>
  );
};

export default NecessaryInformation;
