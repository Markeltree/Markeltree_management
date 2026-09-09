import { createContext, useContext, useState } from "react";
import { clsx, Icon } from "@/common/imports";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [ModalComponent, setModalComponent] = useState(null);
  const [modalProps, setModalProps] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openModal = (Component, props = {}) => {
    setModalComponent(() => Component);
    setModalProps(props);
    setIsOpen(true);
    setTimeout(() => setVisible(true), 10);
  };

  // Show confirmation
  const requestCloseModal = () => {
    setIsConfirmOpen(true);
  };

  // Close without asking
  const forceCloseModal = () => {
    setIsConfirmOpen(false);
    setVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      setModalComponent(null);
      setModalProps({});
    }, 200);
  };

  const cancelClose = () => {
    setIsConfirmOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal: forceCloseModal, // Direct close for programmatic use
      }}
    >
      {children}

      {isOpen && ModalComponent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 dark:bg-black/50"
            onClick={requestCloseModal} // Backdrop triggers confirmation
          />
          {/* Modal content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "relative transition-all duration-300 ease-out transform",
              visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
              "bg-white dark:bg-[#0D0D0D] p-6 rounded-xl",
              "border border-gray-200 dark:border-gray-700",
              "shadow-[0_25px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_rgba(255,255,255,0.15)]",
              modalProps.sizeClass
            )}
          >
            {/* Close button triggers confirmation */}
            <button
              onClick={requestCloseModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
            >
              <Icon
                icon="maki:cross"
                width="15"
                height="15"
                className="text-xl text-[#151D48] dark:text-[#F2F2FE]"
              />
            </button>
            {/* Modal content gets both props and direct close function */}
            <ModalComponent {...modalProps} closeModal={forceCloseModal} />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelClose} // Clicking outside cancels
          />
          <div
            className="relative bg-white dark:bg-[#0D0D0D] p-6 rounded-xl w-[340px] text-center
                         border border-gray-200 dark:border-gray-700
                         shadow-[0_25px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_rgba(255,255,255,0.15)]"
          >
            <p className="mb-4 text-[#737791] dark:text-[#A9A9CD] whitespace-nowrap">
              Are you sure you want to close this?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={forceCloseModal}
                className="px-4 py-2 w-20 bg-[#5D5FEF] text-white dark:text-black rounded transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]"
              >
                Yes
              </button>
              <button
                onClick={cancelClose}
                className="px-4 py-2 w-20 border border-[#5D5FEF] bg-white dark:bg-[#0D0D0D] text-[#5D5FEF] rounded transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
