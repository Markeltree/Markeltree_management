import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Picker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useLocation } from "react-router-dom";
import Quill from "quill";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
  ],
  keyboard: {
    bindings: {
      tab: {
        key: 9,
        handler: function (range, context) {
          if (context.format.list) {
            this.quill.format("indent", "+1", "user");
            return false;
          }
          return true;
        },
      },
      shiftTab: {
        key: 9,
        shiftKey: true,
        handler: function (range, context) {
          if (context.format.list && context.format.indent > 0) {
            this.quill.format("indent", "-1", "user");
            return false;
          }
          return true;
        },
      },
    },
  },
};

const users = [
  { id: 1, name: "Decio Emanuel", avatar: "/avatar1.png", online: true },
  { id: 2, name: "John Smith", avatar: "/avatar2.png", online: false },
  { id: 3, name: "Sarah Jamieson", avatar: "/avatar3.png", online: true },
  { id: 4, name: "Rachel Harris", avatar: "/avatar1.png", online: false },
  { id: 5, name: "Michael Brown", avatar: "/avatar2.png", online: true },
  { id: 6, name: "Emily Davis", avatar: "/avatar3.png", online: false },
  { id: 7, name: "Daniel Wilson", avatar: "/avatar1.png", online: true },
  { id: 8, name: "Sophia Taylor", avatar: "/avatar2.png", online: true },
  { id: 9, name: "James Anderson", avatar: "/avatar3.png", online: false },
  { id: 10, name: "Olivia Thomas", avatar: "/avatar1.png", online: true },
  { id: 11, name: "Ali Ahmed", avatar: "/avatar1.png", online: true },
  { id: 12, name: "Shoaib Ahmed", avatar: "/avatar2.png", online: true },
];

export default function ChatPanel() {
  const [messagesText, setMessagesText] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState("");
  const [groupMemberSearch, setGroupMemberSearch] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupAvatarFile, setNewGroupAvatarFile] = useState(null);
  const [newGroupAvatarUrl, setNewGroupAvatarUrl] = useState(null);
  const [isGroupNameEmpty, setIsGroupNameEmpty] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [activePanel, setActivePanel] = useState("home");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);

  // Dummy groups
  const [groups, setGroups] = useState([
    {
      id: "g1",
      name: "Project: Distribution System",
      members: [1, 2, 3, "me"],
      avatar: "/groupAvatar.png",
      isGroup: true,
    },
  ]);

  const currentUser = {
    id: "me",
    name: "Hasnain",
    avatar: "/avatar2.png",
  };

  const initialMessages = {
    1: [
      {
        id: 1,
        name: "Decio Emanuel",
        text: "Hey mate! How are you?",
        time: "9:16 AM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "I’m good! Just working on a project.",
        time: "9:17 AM",
        align: "right",
      },
      {
        id: 3,
        name: "Decio Emanuel",
        text: "Nice! Let’s catch up later today.",
        time: "9:18 AM",
        align: "left",
      },
    ],
    2: [
      {
        id: 1,
        name: "John Smith",
        text: "Did you finish the report?",
        time: "10:05 AM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Yes, I sent it last night.",
        time: "10:07 AM",
        align: "right",
      },
    ],
    3: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "Are you joining the meeting?",
        time: "11:30 AM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Yes, logging in now.",
        time: "11:31 AM",
        align: "right",
      },
    ],
    4: [
      {
        id: 1,
        name: "Rachel Harris",
        text: "Want to grab lunch later?",
        time: "12:15 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Sure, let’s go at 1.",
        time: "12:16 PM",
        align: "right",
      },
    ],
    5: [
      {
        id: 1,
        name: "Michael Brown",
        text: "Game night tonight?",
        time: "6:00 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Absolutely, can’t wait!",
        time: "6:05 PM",
        align: "right",
      },
    ],
    6: [
      {
        id: 1,
        name: "Emily Davis",
        text: "How’s your new project going?",
        time: "2:45 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Pretty good so far. Exciting stuff.",
        time: "2:46 PM",
        align: "right",
      },
    ],
    7: [
      {
        id: 1,
        name: "Daniel Wilson",
        text: "Are you free this weekend?",
        time: "3:20 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Yeah, let’s plan something fun!",
        time: "3:22 PM",
        align: "right",
      },
    ],
    8: [
      {
        id: 1,
        name: "Sophia Taylor",
        text: "I loved that new series!",
        time: "8:10 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Me too, can’t wait for season 2.",
        time: "8:12 PM",
        align: "right",
      },
    ],
    9: [
      {
        id: 1,
        name: "James Anderson",
        text: "The client called today.",
        time: "4:00 PM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "What did they say?",
        time: "4:01 PM",
        align: "right",
      },
      {
        id: 3,
        name: "James Anderson",
        text: "They’re happy with the progress.",
        time: "4:02 PM",
        align: "left",
      },
    ],
    10: [
      {
        id: 1,
        name: "Olivia Thomas",
        text: "Good morning! 🌞",
        time: "9:00 AM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Morning Olivia! How’s your day starting?",
        time: "9:02 AM",
        align: "right",
      },
    ],
    g1: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "Hey team, let's finalize the report.",
        time: "9:00 AM",
        align: "left",
      },
      {
        id: 2,
        name: "You",
        text: "Sure, I will upload my part by noon.",
        time: "9:05 AM",
        align: "right",
      },
      {
        id: 3,
        name: "John Smith",
        text: "I have completed my section as well.",
        time: "9:10 AM",
        align: "left",
      },
    ],
  };

  const availableUsers = users;

  const [messages, setMessages] = useState(initialMessages);
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !favorites.includes(u.id)
  );
  const favoriteUsers = users.filter((u) => favorites.includes(u.id));
  const regularUsers = filteredUsers.filter((u) => !favorites.includes(u.id));

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesText]);

  // Collapse sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Select first user by default
  useEffect(() => {
    if (!activeUser && users.length > 0) {
      setActiveUser(users[0]);
    }
  }, [activeUser, users]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userName = params.get("user"); // e.g., "John Smith"

    if (userName) {
      const matchedUser = users.find(
        (u) => u.name.toLowerCase() === userName.toLowerCase()
      );
      if (matchedUser) {
        setActiveUser(matchedUser);
      }
    }
  }, [location.search]);

  const handleSend = () => {
    if (!message.trim() || !activeUser) return;

    const html = message;

    const newMessage = {
      id: Date.now(),
      text: html,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      align: "right",
      name: "You",
    };

    setMessages((prev) => ({
      ...prev,
      [activeUser.id]: [...(prev[activeUser.id] || []), newMessage],
    }));

    // ✅ Add this block: only add user to regularUsers after first message
    if (!regularUsers.some((u) => u.id === activeUser.id)) {
      setRegularUsers((prev) => [...prev, activeUser]);
    }

    setMessage("");
  };

  const handleEmojiSelect = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleMentionClick = () => {
    setMessage((prev) => prev + "@");
    inputRef.current?.focus();
  };

  const handleUserClick = (user) => {
    setActiveUser(user);
    setSidebarOpen(false);
  };

  const toggleFavorite = (userId) => {
    setFavorites((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleMemberSelection = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    // create unique id
    const newGroupId = `g${Date.now()}`;

    // ensure current user is included
    const membersIds = Array.from(
      new Set([...selectedMemberIds, currentUser.id])
    );

    // avatar: uploaded file preview (if any) otherwise fallback
    const avatarUrl = newGroupAvatarUrl || "/groupAvatar.png";

    const newGroup = {
      id: newGroupId,
      name: newGroupName,
      members: membersIds,
      avatar: avatarUrl,
      isGroup: true,
    };

    // add to groups
    setGroups((prev) => [...prev, newGroup]);

    // ensure we have a messages array for this group (empty)
    setMessages((prev) => ({ ...prev, [newGroupId]: [] }));

    // reset modal state
    setNewGroupName("");
    setNewGroupAvatarFile(null);
    setNewGroupAvatarUrl(null);
    setSelectedMemberIds([]);
    setGroupModalOpen(false);
    s;
  };

  const isDuplicateGroupName = groups.some(
    (g) => g.name.trim().toLowerCase() === newGroupName.trim().toLowerCase()
  );

  const sortedUsers = [...users].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#141414]">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-black text-black dark:text-white flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 z-50
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} p-4`}
      >
        {/* Collapse button */}
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={() => setSidebarOpen(false)}>
            <Icon icon="mdi:close" width="24" />
          </button>
        </div>

        {/* Current User Info */}
        <div className="flex items-center gap-3 pl-2 pr-2 pb-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              You
            </span>
          </div>
        </div>

        {/* Search + Create Group + New Chat */}
        <div className="flex items-center gap-2 p-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              width="18"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 
         bg-white dark:bg-[#000000] text-sm shadow-sm 
         focus:outline-none focus:ring-0
         transition"
            />
          </div>

          {/* Create Group Icon */}
          <button
            onClick={() => setGroupModalOpen(true)}
            className="p-2 rounded-lg hover:bg-[#5D5FEF] hover:text-white transition"
            title="Create Group"
          >
            <Icon
              icon="heroicons:user-group-16-solid"
              width="24"
              height="24"
              className="text-[#5D5FEF] hover:text-white"
            />
          </button>

          {/* New Chat Icon */}
          <button
            onClick={() => {
              setActiveUser(null);
              setNewChatModalOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-[#5D5FEF] hover:text-white transition"
            title="Start New Chat"
          >
            <Icon
              icon="pajamas:duo-chat-new"
              width="18"
              height="18"
              className="text-[#5D5FEF] hover:text-white"
            />
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>

        {/* Sidebar list (Groups / Favorites / Chats) */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
          {/* Groups Section */}
          {groups.length > 0 && (
            <>
              <div className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wide">
                Groups
              </div>
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center gap-3 px-4 py-2 mb-1 text-[14px] cursor-pointer hover:bg-[#5D5FEF1A] dark:hover:bg-[#7476F140] rounded-md ${
                    activeUser?.id === group.id
                      ? "bg-[#5D5FEF] dark:bg-[#7476F1] text-white"
                      : "dark:text-[#8E8E9C]"
                  }`}
                  onClick={() => {
                    setActiveUser({ ...group, isGroup: true });
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <span className="truncate">{group.name}</span>
                </div>
              ))}
            </>
          )}

          {/* Favorite Users */}
          {favoriteUsers.length > 0 && (
            <>
              <div className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wide mt-2">
                Favorites
              </div>
              {favoriteUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 px-4 py-2 mb-1 text-[14px] cursor-pointer hover:bg-[#5D5FEF1A] dark:hover:bg-[#7476F140] rounded-md ${
                    activeUser?.id === user.id
                      ? "bg-[#5D5FEF] dark:bg-[#7476F1] text-white "
                      : "dark:text-[#8E8E9C]"
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="truncate">{user.name}</span>
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${
                      user.online ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                </div>
              ))}
            </>
          )}

          {/* Regular Users */}
          {regularUsers.filter(
            (u) => messages[u.id] && messages[u.id].length > 0
          ).length > 0 && (
            <>
              <div className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wide mt-2">
                Chats
              </div>
              {regularUsers
                .filter((u) => messages[u.id] && messages[u.id].length > 0) // ✅ only users with messages
                .map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 px-4 py-2 mb-1 text-[14px] cursor-pointer hover:bg-[#5D5FEF1A] dark:hover:bg-[#7476F140] rounded-md ${
                      activeUser?.id === user.id
                        ? "bg-[#5D5FEF] dark:bg-[#7476F1] text-white "
                        : "dark:text-[#8E8E9C]"
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="truncate">{user.name}</span>
                    <span
                      className={`ml-auto w-2 h-2 rounded-full ${
                        user.online ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex flex-row justify-start items-center gap-2 p-4 bg-white dark:bg-[#000000] shadow-sm">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden text-[#5D5FEF] hover:bg-[#5D5FEF]/10 p-2 rounded-lg transition"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Icon icon="mdi:menu" width="24" />
          </button>

          <h1 className="flex items-center text-md font-semibold text-[#5D5FEF]">
            <button
              onClick={() => {
                console.log("Navigating to dashboard...");
                navigate("/dashboard");
              }}
              className="flex items-center text-[#5D5FEF] hover:underline"
            >
              Dashboard
            </button>
            <Icon
              icon="mdi:chevron-right"
              className="mx-1 text-[#5D5FEF]"
              width="16"
              height="16"
            />
            Chat
          </h1>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="px-6 py-4 overflow-y-auto flex-1 space-y-4 bg-gray-50 dark:bg-[#1a1a1a] m-1 rounded-lg pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent"
        >
          {activeUser ? (
            <>
              {/* Compact Chat Header (fixed → no border) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Avatar + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-12 h-12 rounded-full shadow"
                  />
                  <div>
                    <h2 className="text-sm dark:text-white font-semibold">
                      {activeUser.name}
                    </h2>
                    {!activeUser.isGroup && (
                      <p
                        className={`text-xs ${
                          activeUser.online ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        {activeUser.online ? "Online" : "Offline"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-wrap gap-2 justify-end mt-3 sm:mt-0">
                  {!activeUser.isGroup && (
                    <button
                      onClick={() => toggleFavorite(activeUser.id)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                    >
                      <Icon
                        icon={
                          favorites.includes(activeUser.id)
                            ? "mdi:star"
                            : "mdi:star-outline"
                        }
                        width="24"
                      />
                    </button>
                  )}

                  {activeUser.isGroup ? (
                    <>
                      <button
                        onClick={() => setShowGroupMembers(true)}
                        className="h-8 flex items-center justify-center px-3 border border-[#5D5FEF] text-[#5D5FEF] rounded-full text-xs hover:bg-[#5D5FEF] hover:text-white shadow-sm transition"
                      >
                        View Members
                      </button>

                      <button
                        onClick={() => setShowAddMember(true)}
                        className="h-8 flex items-center justify-center px-3 border border-[#5D5FEF] text-[#5D5FEF] rounded-full text-xs hover:bg-[#5D5FEF] hover:text-white shadow-sm transition"
                      >
                        <Icon
                          icon="mdi:account-plus-outline"
                          width="18"
                          height="18"
                        />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowProfile(true)}
                      className="h-8 flex items-center justify-center px-3 border border-[#5D5FEF] text-[#5D5FEF] rounded-full text-xs hover:bg-[#5D5FEF] hover:text-white shadow-sm transition"
                    >
                      View Profile
                    </button>
                  )}
                </div>
              </div>

              {/* ✅ Only Date Separator */}
              <div className="flex items-center justify-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="mx-3 text-xs text-gray-500 bg-white dark:bg-[#0D0D0D] px-3 py-1 rounded-full shadow-sm">
                  Today •{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Chat Messages */}
              {(messages[activeUser.id] || []).map((msg) => {
                const isRight = msg.align === "right";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isRight ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex gap-2 max-w-lg">
                      {!isRight && (
                        <img
                          src={
                            activeUser.isGroup
                              ? users.find((u) => u.name === msg.name)
                                  ?.avatar || activeUser.avatar
                              : activeUser.avatar
                          }
                          alt={msg.name}
                          className="w-8 h-8 rounded-full flex-shrink-0 self-start shadow"
                        />
                      )}
                      <div
                        className={`flex flex-col p-3 rounded-xl shadow-sm ${
                          isRight
                            ? "bg-[#5D5FEF] text-white"
                            : "bg-white dark:bg-[#2C2C2E] text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 justify-between mb-1">
                          <span className="font-semibold text-xs">
                            {msg.name}
                          </span>
                          <span className="text-[10px] opacity-70">
                            {msg.time}
                          </span>
                        </div>
                        <div
                          className="quill-content max-w-none text-sm dark:text-white"
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                      </div>
                      {isRight && (
                        <img
                          src={currentUser.avatar}
                          alt="You"
                          className="w-8 h-8 rounded-full flex-shrink-0 self-start shadow"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Select a user to start chatting
            </div>
          )}
        </div>

        {/* Input Footer */}
        {activeUser && (
          <div className="relative">
            {showEmojiPicker && (
              <div className="absolute bottom-[60px] left-4 z-50">
                <Picker onEmojiClick={handleEmojiSelect} theme="light" />
              </div>
            )}

            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000000] flex flex-col gap-2 shadow-lg">
              {/* Rich Text Editor */}
              <ReactQuill
                theme="snow"
                value={message}
                onChange={setMessage}
                modules={modules}
                placeholder="Start typing..."
                className="chat-editor rounded-lg dark:bg-[#000000] dark:text-white shadow-sm"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                >
                  <Icon icon="fluent:emoji-16-regular" width="20" />
                </button>

                <button
                  onClick={handleMentionClick}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                >
                  <Icon icon="fluent:mention-16-regular" width="20" />
                </button>

                <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">
                  <Icon icon="mdi:paperclip" width="20" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        console.log("Attached:", file.name);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={handleSend}
                  className="ml-auto text-blue-600 hover:text-blue-800 transition"
                >
                  <Icon icon="mdi:send" width="20" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && activeUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white dark:bg-[#0D0D0D] rounded-xl p-6 w-96 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" width="20" />
            </button>

            {/* User Info */}
            <div className="flex flex-col items-center text-center">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-24 h-24 rounded-full mb-3"
              />
              <h2 className="text-lg dark:text-white font-semibold">
                {activeUser.name}
              </h2>
              <p
                className={`text-sm mb-3 ${
                  activeUser.online ? "text-green-500" : "text-gray-400"
                }`}
              >
                {activeUser.online ? "Online" : "Offline"}
              </p>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                This conversation is just between you and {activeUser.name}. You
                can add them to favorites for quicker access.
              </p>

              {/* Favorite Toggle */}
              <button
                onClick={() => toggleFavorite(activeUser.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  favorites.includes(activeUser.id)
                    ? "bg-[#5D5FEF] text-white"
                    : "bg-white dark:bg-[#0D0D0D] border-[#5D5FEF] dark:border-[#5D5FEF] text-[#5D5FEF] dark:text-[#5D5FEF]"
                }`}
              >
                <Icon
                  icon={
                    favorites.includes(activeUser.id)
                      ? "mdi:star"
                      : "mdi:star-outline"
                  }
                  width="20"
                />
                {favorites.includes(activeUser.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Popup */}
      {showAddMember && activeUser?.isGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white dark:bg-[#0D0D0D] rounded-xl p-6 w-96 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAddMember(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" width="20" />
            </button>

            <h2 className="text-lg dark:text-white font-semibold mb-4">
              Add Member
            </h2>

            {/* Search Bar with Icon */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mdi:magnify" width="20" />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                value={addMemberSearch}
                onChange={(e) => setAddMemberSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col pr-3 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
              {users.filter(
                (u) =>
                  !activeUser.members.includes(u.id) &&
                  u.name.toLowerCase().includes(addMemberSearch.toLowerCase())
              ).length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No member found
                </p>
              ) : (
                users
                  .filter(
                    (u) =>
                      !activeUser.members.includes(u.id) &&
                      u.name
                        .toLowerCase()
                        .includes(addMemberSearch.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2c2c2e] p-2 rounded"
                      onClick={() => {
                        setGroups((prev) =>
                          prev.map((g) =>
                            g.id === activeUser.id
                              ? { ...g, members: [...g.members, user.id] }
                              : g
                          )
                        );
                        setActiveUser((prev) =>
                          prev.id === activeUser.id
                            ? { ...prev, members: [...prev.members, user.id] }
                            : prev
                        );
                        setShowAddMember(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm dark:text-white font-medium">
                          {user.name}
                        </span>
                      </div>
                      <Icon
                        icon="mdi:account-plus"
                        width="20"
                        className="dark:text-white"
                      />
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Group Members Popup */}
      {showGroupMembers && activeUser?.isGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white dark:bg-[#0D0D0D] rounded-xl p-6 w-96 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowGroupMembers(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" width="20" />
            </button>

            <h2 className="text-lg dark:text-white font-semibold mb-4">
              Group Members
            </h2>

            {/* Search Bar with Icon */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mdi:magnify" width="20" />
              </span>
              <input
                type="text"
                placeholder="Search members..."
                value={groupMemberSearch}
                onChange={(e) => setGroupMemberSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {activeUser.members
                .map((memberId) =>
                  memberId === "me"
                    ? currentUser
                    : users.find((u) => u.id === memberId)
                )
                .filter((user) =>
                  user?.name
                    .toLowerCase()
                    .includes(groupMemberSearch.toLowerCase())
                ).length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No member found
                </p>
              ) : (
                activeUser.members
                  .map((memberId) =>
                    memberId === "me"
                      ? currentUser
                      : users.find((u) => u.id === memberId)
                  )
                  .filter((user) =>
                    user?.name
                      .toLowerCase()
                      .includes(groupMemberSearch.toLowerCase())
                  )
                  .map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm dark:text-white font-medium">
                        {user.name}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {groupModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0D0D0D] rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg dark:text-white font-semibold mb-4">
              Create Group
            </h2>

            {/* Group Name */}
            <label
              htmlFor="groupName"
              className="block text-[12px] text-[#737791] dark:text-[#A9A9CD] mb-1"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
                if (e.target.value.trim() !== "") {
                  setIsGroupNameEmpty(false);
                }
              }}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none 
          ${
            isDuplicateGroupName || isGroupNameEmpty
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          } 
          dark:bg-[#0D0D0D] dark:text-white`}
            />
            {isDuplicateGroupName && (
              <p className="text-red-500 text-xs mt-1">
                A group with this name already exists.
              </p>
            )}
            {isGroupNameEmpty && (
              <p className="text-red-500 text-xs mt-1">
                Group name is required.
              </p>
            )}

            {/* Upload Avatar */}
            <label className="block mt-4 text-[12px] text-[#737791] dark:text-[#A9A9CD]">
              Group Avatar:
            </label>
            <div className="flex items-center gap-4 mt-2 mb-4">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-[#5D5FEF] rounded-lg px-3 py-1 text-center text-sm text-[#5D5FEF] hover:bg-[#5D5FEF]/5 transition">
                <Icon
                  icon="mdi:cloud-upload-outline"
                  className="mx-auto mb-1"
                  width="24"
                />
                <span className="block">Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewGroupAvatarFile(file);
                      setNewGroupAvatarUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              {newGroupAvatarUrl && (
                <img
                  src={newGroupAvatarUrl}
                  alt="avatar preview"
                  className="w-12 h-12 rounded-full object-cover border shadow"
                />
              )}
            </div>

            {/* Select Members */}
            <MultiSelectDropdown
              label="Select Member"
              members={users.map((user) => user.name)}
              onChange={(selectedNames) => {
                const ids = users
                  .filter((u) => selectedNames.includes(u.name))
                  .map((u) => u.id);
                setSelectedMemberIds(ids);
              }}
            />

            {/* Actions */}
            <div className="flex flex-row gap-2 mt-4">
              <button
                onClick={() => setGroupModalOpen(false)}
                className="w-full px-3 py-2 rounded-lg border border-[#5D5FEF] text-[#5D5FEF] hover:bg-[#5D5FEF1A] dark:hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newGroupName.trim() === "") {
                    setIsGroupNameEmpty(true);
                    return;
                  }
                  handleCreateGroup();
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#5D5FEF] text-white hover:bg-[#4a4cd1]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0D0D0D] rounded-lg p-6 w-96 shadow-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg dark:text-white font-semibold">
                Start New Chat
              </h2>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Icon icon="mdi:close" width="20" />
              </button>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search users..."
              value={newChatSearch}
              onChange={(e) => setNewChatSearch(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-white"
            />

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
              {users
                .filter((u) =>
                  u.name.toLowerCase().includes(newChatSearch.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-4 py-2 mb-1 cursor-pointer hover:bg-[#5D5FEF] hover:text-white rounded-md"
                    onClick={() => {
                      setActiveUser(user);
                      setNewChatModalOpen(false);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="truncate dark:text-white">
                      {user.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
