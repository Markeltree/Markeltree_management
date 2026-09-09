import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/common/imports";
import { useNavigate } from "react-router-dom";

export default function UserProfile({
  username: initialUsername = "John Doe",
  view = "Software Engineer",
  imgSrc: initialImgSrc = null,
  className = "",
  avatarSize = "medium",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "ryan",
    email: "ryan@example.com",
    password: "password",
    fullName: "John Doe",
    title: "Administrator",
    language: "English",
    avatar: initialImgSrc || "/default-avatar.png",
  });

  // Keep separate state for live username/fullName/avatar so changes reflect after save
  const [displayData, setDisplayData] = useState({
    username: formData.username,
    fullName: formData.fullName,
    avatar: formData.avatar,
  });

  // Close dropdown panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // update live display data
    setDisplayData({
      username: formData.username,
      fullName: formData.fullName,
      avatar: formData.avatar,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      {/* Avatar and Username */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          image={displayData.avatar}
          label={
            !displayData.avatar ? displayData.username.charAt(0) : undefined
          }
          shape="circle"
          size={avatarSize}
          className="bg-[#5D5FEF] text-white"
        />
        <div className="flex flex-col leading-tight text-left">
          <span className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
            {displayData.fullName}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-400 whitespace-nowrap">
            {view}
          </span>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
          <div className="flex flex-col items-center gap-1">
            <Avatar
              image={displayData.avatar}
              label={
                !displayData.avatar ? displayData.username.charAt(0) : undefined
              }
              shape="circle"
              size="large"
              className="bg-[#5D5FEF] text-white"
            />
            <span className="font-semibold text-black dark:text-white">
              {displayData.fullName}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {view}
            </span>
          </div>
          <div className="flex justify-between mt-3 text-[12px] gap-2">
            <button
              className="flex-1 px-3 py-1 bg-[#5D5FEF] text-white rounded"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white dark:bg-gray-900 w-[700px] h-[75vh] rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-end items-center pt-2 pb-2 pl-4 pr-4 border-b">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  form="editProfileForm"
                  className="px-4 py-2 bg-[#5D5FEF] text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col lg:flex-row gap-6">
              {/* Left side - Avatar */}
              <div className="flex flex-col items-center lg:w-1/3">
                <img
                  src={formData.avatar || "/default-avatar.png"}
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <h3 className="mt-3 text-md font-semibold text-gray-900 dark:text-white">
                  {formData.fullName}
                </h3>
                <p className="text-sm text-blue-600">{formData.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.title}
                </p>

                {/* File upload area */}
                <label className="mt-3 w-full border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500 text-sm cursor-pointer hover:bg-gray-50">
                  Drop your files here or{" "}
                  <span className="text-blue-500">click in this area</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Right side - Account form */}
              <div className="flex-1">
                <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
                  Account
                </h3>

                <form
                  id="editProfileForm"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded text-black dark:text-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded text-black dark:text-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded text-black dark:text-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded text-black dark:text-white dark:bg-gray-700"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
