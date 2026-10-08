import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Smile } from "lucide-react";
import Quill from "quill";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Voice Preview Component (for pre-send preview)
const VoicePreviewComponent = ({ audioBlob, duration, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);

  // Create URL for audio blob
  const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setAudioDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      const handleError = (e) => {
        console.error("Audio playback error:", e);
        console.error("Audio error details:", {
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src,
        });
        setAudioError(
          "Failed to load audio: " + (audio.error?.message || "Unknown error")
        );
      };
      const handleCanPlay = () => {
        console.log(
          "Audio can play - duration:",
          audio.duration,
          "readyState:",
          audio.readyState
        );
        setAudioError(null);
      };
      const handleLoadStart = () => {
        console.log("Audio load started");
      };
      const handleLoadedMetadata = () => {
        console.log("Audio metadata loaded - duration:", audio.duration);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [audioUrl]);

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        console.log(
          "Toggle play - isPlaying:",
          isPlaying,
          "audioUrl:",
          audioUrl
        );
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          console.log("Attempting to play audio...");
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("Audio play started successfully");
        }
      } catch (error) {
        console.error("Playback error:", error);
        setAudioError("Playback failed: " + error.message);
      }
    } else {
      console.error("Audio ref not available");
      setAudioError("Audio not ready");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        controls={false}
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#3F0E40] text-white hover:bg-[#2a0a2b] flex items-center justify-center transition-colors"
        disabled={audioError}
      >
        <Icon icon={isPlaying ? "mdi:pause" : "mdi:play"} width="20" />
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 min-w-0">
        {/* Waveform bars */}
        <div className="flex items-center gap-1 h-8">
          {[...Array(20)].map((_, i) => {
            const height = Math.random() * 20 + 8;
            const isActive = (i / 20) * 100 <= progress;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isActive ? "bg-[#3F0E40]" : "bg-[#3F0E40]/30"
                }`}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>

        {/* Time display */}
        <div className="text-xs mt-1 text-left text-gray-500">
          {audioError
            ? audioError
            : `${formatTime(currentTime)} / ${formatTime(audioDuration)}`}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        title="Delete recording"
      >
        <Icon icon="mdi:delete" width="16" />
      </button>
    </div>
  );
};

// Voice Message Component (WhatsApp-style)
const VoiceMessageComponent = ({ audioUrl, duration, isRight }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setAudioDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 mt-2 ${
        isRight ? "flex-row-reverse" : ""
      }`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          isRight
            ? "bg-white text-[#3F0E40] hover:bg-gray-100"
            : "bg-[#3F0E40] text-white hover:bg-[#2a0a2b]"
        }`}
      >
        <Icon icon={isPlaying ? "mdi:pause" : "mdi:play"} width="20" />
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 min-w-0">
        {/* Waveform bars */}
        <div className="flex items-center gap-1 h-8">
          {[...Array(20)].map((_, i) => {
            const height = Math.random() * 20 + 8;
            const isActive = (i / 20) * 100 <= progress;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? isRight
                      ? "bg-white"
                      : "bg-[#3F0E40]"
                    : isRight
                    ? "bg-white/30"
                    : "bg-[#3F0E40]/30"
                }`}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>

        {/* Time display */}
        <div
          className={`text-xs mt-1 ${isRight ? "text-right" : "text-left"} ${
            isRight ? "text-white/70" : "text-gray-500"
          }`}
        >
          {formatTime(currentTime)} / {formatTime(audioDuration)}
        </div>
      </div>
    </div>
  );
};

// pick icon based on file extension or MIME type
const getFileIcon = (file) => {
  if (!file) return "mdi:file-outline"; // safeguard

  const name = file.name?.toLowerCase() || "";
  const type = file.type || "";

  if (name.endsWith(".pdf") || type === "application/pdf") {
    return "material-icon-theme:pdf";
  }
  if (
    name.endsWith(".xls") ||
    name.endsWith(".xlsx") ||
    type.includes("spreadsheet")
  ) {
    return "vscode-icons:file-type-excel2";
  }
  if (
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    type.includes("word")
  ) {
    return "vscode-icons:file-type-word";
  }
  if (name.endsWith(".csv")) {
    return "vscode-icons:file-type-excel2";
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".gif") ||
    type.startsWith("image/")
  ) {
    return "material-symbols:image";
  }
  if (name.endsWith(".txt") || type.includes("text/plain")) {
    return "bxs:file-txt";
  }
  return "mdi:file-outline"; // fallback generic icon
};

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

// Custom modules for edit replies - only specific toolbar options
const editReplyModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
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
  { id: 2, name: "John Smith", avatar: "/avatar3.png", online: false },
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
  { id: 13, name: "Shoaib Akhtar", avatar: "/avatar1.png", online: true },
];

export default function ChatPanel({ username = "Hasnain" }) {
  const location = useLocation();
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
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [initialMessagesState, setInitialMessagesState] = useState(null);
  const [isGroupNameEmpty, setIsGroupNameEmpty] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [activePanel, setActivePanel] = useState("home");
  const [activeTab, setActiveTab] = useState("messages");
  const [showFilePanel, setShowFilePanel] = useState(false);
  const [highlightedFileId, setHighlightedFileId] = useState(null);
  const filePanelTimeoutRef = useRef(null);
  const activityPanelTimeoutRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());
  const [replyBoxForMsgId, setReplyBoxForMsgId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const threadScrollRef = useRef(null);
  const sidebarRef = useRef(null);
  const [threadOpen, setThreadOpen] = useState(false);
  const [threadMsg, setThreadMsg] = useState(null);
  const [threadReplyText, setThreadReplyText] = useState("");
  const threadReplyInputRef = useRef(null);
  const [threadShowEmojiPicker, setThreadShowEmojiPicker] = useState(false);
  const [threadShowMentionList, setThreadShowMentionList] = useState(false);
  const [threadMentionSearch, setThreadMentionSearch] = useState("");
  const [threadSelectedMentionIndex, setThreadSelectedMentionIndex] =
    useState(0);
  const [threadAttachedFile, setThreadAttachedFile] = useState(null);
  const [threadAttachedPreviewUrl, setThreadAttachedPreviewUrl] =
    useState(null);
  const threadQuillRef = useRef(null);
  const threadFileInputRef = useRef(null);
  const threadMentionButtonRef = useRef(null);
  const threadMentionListRef = useRef(null);
  const [threadIsRecordingAudio, setThreadIsRecordingAudio] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyText, setEditingReplyText] = useState("");
  const [hoveredReplyId, setHoveredReplyId] = useState(null);
  const [showReplyMenu, setShowReplyMenu] = useState(null);
  const editReplyQuillRef = useRef(null);
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const editMessageQuillRef = useRef(null);
  const [threadIsRecordingVideo, setThreadIsRecordingVideo] = useState(false);
  const [threadIsPaused, setThreadIsPaused] = useState(false);
  const [threadAudioBlob, setThreadAudioBlob] = useState(null);
  const [threadVideoBlob, setThreadVideoBlob] = useState(null);
  const threadMediaRecorderRef = useRef(null);
  const threadVideoRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreviewUrl, setAttachedPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // ---------- MENTION: add these near other hooks at top of component ----------
  const quillRef = useRef(null); // ref to ReactQuill component
  const mentionButtonRef = useRef(null); // ref to the @ button
  const mentionListRef = useRef(null); // ref to the dropdown
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  const [showChannels, setShowChannels] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [showThreadsPage, setShowThreadsPage] = useState(false);

  // Threads page reply states
  const [threadsPageReplyTexts, setThreadsPageReplyTexts] = useState({});
  const [threadsPageShowEmojiPickers, setThreadsPageShowEmojiPickers] =
    useState({});
  const [threadsPageShowMentionLists, setThreadsPageShowMentionLists] =
    useState({});
  const [threadsPageMentionSearches, setThreadsPageMentionSearches] = useState(
    {}
  );
  const [
    threadsPageSelectedMentionIndexes,
    setThreadsPageSelectedMentionIndexes,
  ] = useState({});
  const [threadsPageAttachedFiles, setThreadsPageAttachedFiles] = useState({});
  const [threadsPageAttachedPreviewUrls, setThreadsPageAttachedPreviewUrls] =
    useState({});
  const threadsPageQuillRefs = useRef({});
  const threadsPageFileInputRefs = useRef({});
  const threadsPageMentionButtonRefs = useRef({});
  const threadsPageMentionListRefs = useRef({});
  const [threadsPageIsRecordingAudio, setThreadsPageIsRecordingAudio] =
    useState({});
  const [threadsPageIsRecordingVideo, setThreadsPageIsRecordingVideo] =
    useState({});
  const [threadsPageAudioBlobs, setThreadsPageAudioBlobs] = useState({});
  const [threadsPageVideoBlobs, setThreadsPageVideoBlobs] = useState({});
  const [threadsPageRecordingDuration, setThreadsPageRecordingDuration] =
    useState({});
  const [threadsPageIsPaused, setThreadsPageIsPaused] = useState({});

  // Default statuses (Slack-like)
  const defaultStatuses = [
    { text: "Online", type: "online", color: "#22c55e", emoji: "🟢" }, // Green
    { text: "Away", type: "away", color: "#facc15", emoji: "🟡" }, // Yellow
    { text: "Do Not Disturb", type: "dnd", color: "#ef4444", emoji: "🔴" }, // Red
    { text: "In a meeting", type: "meeting", color: "#8b5cf6", emoji: "📅" }, // Purple
    { text: "Out sick", type: "sick", color: "#f97316", emoji: "🤒" }, // Orange
    { text: "Working remotely", type: "remote", color: "#6366f1", emoji: "🏠" }, // Indigo
  ];

  // Current active status
  const [userStatus, setUserStatus] = useState({
    text: "Online",
    type: "online",
    color: "#22c55e",
  });

  // Default status (revert point for custom status)
  const [defaultStatus, setDefaultStatus] = useState(userStatus);

  // Modal selections
  const [selectedStatus, setSelectedStatus] = useState(userStatus); // radio/default
  const [customStatusText, setCustomStatusText] = useState("");
  const [customStatusEmoji, setCustomStatusEmoji] = useState("😊");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [customStatusColor, setCustomStatusColor] = useState("#22c55e");
  const [statusDuration, setStatusDuration] = useState(""); // Duration in minutes
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [showStatusEmojiPicker, setShowStatusEmojiPicker] = useState(false);
  const [statusModalStep, setStatusModalStep] = useState(1); // 1: Select status, 2: Set duration
  const [tempSelectedStatus, setTempSelectedStatus] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [isTimeValid, setIsTimeValid] = useState(true);

  // Status duration options (in minutes)
  const statusDurations = [
    { label: "Don't clear", value: "" },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
    { label: "4 hours", value: 240 },
    { label: "8 hours", value: 480 },
    { label: "Until tomorrow", value: "tomorrow" },
    { label: "Choose date and time", value: "custom" },
  ];

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Validate custom time (must be at least 30 minutes from now)
  const validateCustomTime = (date, time) => {
    if (!date || !time) return true; // Allow empty values

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const timeDiff = selectedDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return minutesDiff >= 30;
  };

  // Re-validate time when date or time changes
  useEffect(() => {
    if (customDate && customTime) {
      const isValid = validateCustomTime(customDate, customTime);
      setIsTimeValid(isValid);
    }
  }, [customDate, customTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedStatus.type === "custom") {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = timeToMinutes(selectedStatus.startTime || "0:0");
        const endMinutes = timeToMinutes(selectedStatus.endTime || "23:59");

        if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
          // Apply custom status
          setUserStatus({
            text: customStatusText || selectedStatus.text,
            type: "custom",
            color: customStatusColor || selectedStatus.color,
            startTime: selectedStatus.startTime,
            endTime: selectedStatus.endTime,
          });
        } else {
          // Revert to default
          if (userStatus.type === "custom") {
            setUserStatus(defaultStatus);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    selectedStatus,
    customStatusText,
    customStatusColor,
    defaultStatus,
    userStatus,
  ]);

  // Handle status selection and move to next step
  const handleStatusSelection = (status) => {
    if (status.type === "custom") {
      setTempSelectedStatus({
        text: customStatusText,
        type: "custom",
        color: customStatusColor,
        emoji: customStatusEmoji,
      });
    } else {
      setTempSelectedStatus(status);
    }
    setStatusModalStep(2);
  };

  // Go back to first step
  const goBackToStatusSelection = () => {
    setStatusModalStep(1);
  };

  // Clear status
  const clearStatus = () => {
    setUserStatus({
      text: "Online",
      type: "online",
      color: "#22c55e",
      emoji: "🟢",
    });
    setDefaultStatus({
      text: "Online",
      type: "online",
      color: "#22c55e",
      emoji: "🟢",
    });
    setStatusModalOpen(false);
    setStatusModalStep(1);
  };

  // Save status from second step
  const saveStatus = () => {
    // Validate custom date/time if selected
    if (statusDuration === "custom") {
      if (!customDate || !customTime) {
        alert("Please select both date and time");
        return;
      }
      if (!isTimeValid) {
        alert("Time must be at least 30 minutes from now");
        return;
      }
    }

    if (tempSelectedStatus) {
      setUserStatus(tempSelectedStatus);
      setDefaultStatus(tempSelectedStatus);
    }

    // Handle duration
    if (statusDuration && statusDuration !== "") {
      if (statusDuration === "tomorrow") {
        // Set to clear at midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        // You can implement a timer here to clear status at midnight
      } else if (statusDuration === "custom") {
        // Set timer to clear at custom date/time
        const clearDateTime = new Date(`${customDate}T${customTime}`);
        const now = new Date();
        const timeDiff = clearDateTime.getTime() - now.getTime();

        if (timeDiff > 0) {
          setTimeout(() => {
            setUserStatus({
              text: "Online",
              type: "online",
              color: "#22c55e",
              emoji: "🟢",
            });
          }, timeDiff);
        }
      } else if (typeof statusDuration === "number") {
        // Set timer to clear after specified minutes
        setTimeout(() => {
          setUserStatus({
            text: "Online",
            type: "online",
            color: "#22c55e",
            emoji: "🟢",
          });
        }, statusDuration * 60 * 1000);
      }
    }

    // Reset all inputs
    setCustomStatusText("");
    setCustomStatusEmoji("😊");
    setCustomStartTime("");
    setCustomEndTime("");
    setCustomStatusColor("#22c55e");
    setStatusDuration("");
    setCustomDate("");
    setCustomTime("");
    setIsTimeValid(true);
    setTempSelectedStatus(null);
    setStatusModalStep(1);

    setStatusModalOpen(false);
  };

  // Dummy channels
  const [channels, setChannels] = useState([
    {
      id: "g1",
      name: "Project: Distribution System",
      members: [1, 2, 3, "me"],
      isGroup: true,
    },
    {
      id: "g2",
      name: "Marketing Team",
      members: [1, 3, 4, "me"],
      isGroup: true,
    },
    {
      id: "g3",
      name: "Development Updates",
      members: [2, 5, 6, "me"],
      isGroup: true,
    },
    {
      id: "g4",
      name: "Customer Support",
      members: [1, 7, 8, "me"],
      isGroup: true,
    },
    {
      id: "g5",
      name: "Design Team",
      members: [3, 9, 10, "me"],
      isGroup: true,
    },
    {
      id: "g6",
      name: "Sales & Business Dev",
      members: [2, 4, 6, "me"],
      isGroup: true,
    },
    {
      id: "g7",
      name: "Tech Support",
      members: [1, 5, 7, "me"],
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
        status: "unread",
        reactions: [{ emoji: "👍", count: 1 }],
      },
      {
        id: 2,
        name: "You",
        text: "I'm good! Just working on a project.",
        time: "9:17 AM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Decio Emanuel",
        text: "Nice! Let's catch up later today.",
        time: "9:18 AM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
      {
        id: 4,
        name: "You",
        text: "Pinned: Project deadline Friday 🚀",
        time: "9:20 AM",
        align: "right",
        status: "read",
      },
      {
        id: 5,
        name: "You",
        text: "I'm good! Just working on a project.",
        time: "9:17 AM",
        align: "right",
        status: "read",
      },
      {
        id: 6,
        name: "You",
        text: "I'm good! Just working on a project.",
        time: "9:17 AM",
        align: "right",
        status: "read",
      },
    ],
    2: [
      {
        id: 1,
        name: "John Smith",
        text: "Did you finish the report?",
        time: "10:05 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Yes, I sent it last night.",
        time: "10:07 AM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "John Smith",
        text: "Uploading file: Report_Q3.pdf",
        time: "10:10 AM",
        align: "left",
        status: "unread",
        type: "file",
        file: {
          name: "Report_Q3.pdf",
          size: "1.2 MB",
        },
      },
    ],
    3: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "Are you joining the meeting?",
        time: "11:30 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Yes, logging in now.",
        time: "11:31 AM",
        align: "right",
        status: "read",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
    ],
    4: [
      {
        id: 1,
        name: "Rachel Harris",
        text: "Want to grab lunch later?",
        time: "12:15 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Sure, let's go at 1.",
        time: "12:16 PM",
        align: "right",
        status: "read",
      },
    ],
    5: [
      {
        id: 1,
        name: "Michael Brown",
        text: "Game night tonight?",
        time: "6:00 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
      {
        id: 2,
        name: "You",
        text: "Absolutely, can't wait!",
        time: "6:05 PM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Michael Brown",
        text: "Pinned: Bring snacks 🍕",
        time: "6:07 PM",
        align: "left",
        status: "unread",
      },
    ],
    6: [
      {
        id: 1,
        name: "Emily Davis",
        text: "How's your new project going?",
        time: "2:45 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Pretty good so far. Exciting stuff.",
        time: "2:46 PM",
        align: "right",
        status: "read",
      },
    ],
    7: [
      {
        id: 1,
        name: "Daniel Wilson",
        text: "Are you free this weekend?",
        time: "3:20 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Yeah, let's plan something fun!",
        time: "3:22 PM",
        align: "right",
        status: "read",
      },
    ],
    8: [
      {
        id: 1,
        name: "Sophia Taylor",
        text: "I loved that new series!",
        time: "8:10 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
      {
        id: 2,
        name: "You",
        text: "Me too, can't wait for season 2.",
        time: "8:12 PM",
        align: "right",
        status: "read",
      },
    ],
    9: [
      {
        id: 1,
        name: "James Anderson",
        text: "The client called today.",
        time: "4:00 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "What did they say?",
        time: "4:01 PM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "James Anderson",
        text: "They're happy with the progress.",
        time: "4:02 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 4,
        name: "You",
        text: "Uploaded: progress_notes.docx",
        time: "4:05 PM",
        align: "right",
        status: "read",
        type: "file",
        file: {
          name: "progress_notes.docx",
          size: "650 KB",
        },
      },
    ],
    10: [
      {
        id: 1,
        name: "Olivia Thomas",
        text: "Good morning! 🌞",
        time: "9:00 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Morning Olivia! How's your day starting?",
        time: "9:02 AM",
        align: "right",
        status: "read",
      },
    ],
    g1: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "Hey team, let's finalize the report.",
        time: "9:00 AM",
        align: "left",
        status: "unread",
        reactions: [
          { emoji: "👍", count: 2 },
          { emoji: "❤️", count: 1 },
        ],
        replies: [
          {
            id: 101,
            name: "You",
            text: "I'll take the intro section.",
            time: "9:12 AM",
            status: "read",
          },
          {
            id: 102,
            name: "John Smith",
            text: "I'll handle references.",
            time: "9:13 AM",
            status: "unread",
          },
        ],
      },
      {
        id: 2,
        name: "You",
        text: "Sure, I will upload my part by noon.",
        time: "9:05 AM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "John Smith",
        text: "I have completed my section as well.",
        time: "9:10 AM",
        align: "left",
        status: "unread",
        replies: [
          {
            id: 101,
            name: "You",
            text: "I'll take the intro section.",
            time: "9:12 AM",
            status: "read",
          },
          {
            id: 102,
            name: "John Smith",
            text: "I'll handle references.",
            time: "9:13 AM",
            status: "unread",
          },
        ],
      },
      {
        id: 4,
        name: "You",
        text: "Pinned: Final draft due tomorrow.",
        time: "9:15 AM",
        align: "right",
        status: "read",
        reactions: [
          { emoji: "👍", count: 2 },
          { emoji: "❤️", count: 1 },
        ],
      },
    ],
    g2: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "New campaign ideas for Q4 - let's brainstorm!",
        time: "10:00 AM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "😮", count: 3 }],
      },
      {
        id: 2,
        name: "Mike Chen",
        text: "I have some social media concepts ready.",
        time: "10:15 AM",
        align: "left",
        status: "read",
      },
      {
        id: 3,
        name: "You",
        text: "Great! Let's schedule a meeting to review them.",
        time: "10:20 AM",
        align: "right",
        status: "read",
      },
      {
        id: 4,
        name: "Sarah Jamieson",
        text: "How about tomorrow at 2 PM?",
        time: "10:25 AM",
        align: "left",
        status: "unread",
        replies: [
          {
            id: 201,
            name: "Mike Chen",
            text: "Works for me!",
            time: "10:26 AM",
            status: "unread",
          },
          {
            id: 202,
            name: "You",
            text: "Perfect, see you then.",
            time: "10:27 AM",
            status: "read",
          },
        ],
      },
      {
        id: 5,
        name: "Mike Chen",
        text: "I'll prepare the presentation slides.",
        time: "10:30 AM",
        align: "left",
        status: "unread",
      },
    ],
    g3: [
      {
        id: 1,
        name: "Joe Williams",
        text: "Version 2.1.0 is ready for testing.",
        time: "2:30 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "👍", count: 2 }],
      },
      {
        id: 2,
        name: "Alex Smith",
        text: "Great! I'll start QA testing now.",
        time: "2:45 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 3,
        name: "You",
        text: "What are the main features in this release?",
        time: "2:50 PM",
        align: "right",
        status: "read",
      },
      {
        id: 4,
        name: "Joe Williams",
        text: "New dashboard UI, performance improvements, and bug fixes.",
        time: "2:55 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 5,
        name: "Alex Smith",
        text: "Found a minor issue with the login flow, but overall looks good!",
        time: "3:30 PM",
        align: "left",
        status: "unread",
        replies: [
          {
            id: 301,
            name: "Joe Williams",
            text: "Thanks! I'll fix that today.",
            time: "3:32 PM",
            status: "unread",
          },
        ],
      },
      {
        id: 6,
        name: "You",
        text: "Pinned: Release scheduled for Friday",
        time: "3:35 PM",
        align: "right",
        status: "read",
        type: "pin",
      },
    ],
    g4: [
      {
        id: 1,
        name: "Emily Davis",
        text: "Customer reported issue with login - investigating.",
        time: "11:20 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Is this related to the server update yesterday?",
        time: "11:25 AM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Emily Davis",
        text: "Possibly. I'll check the logs and get back to you.",
        time: "11:30 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 4,
        name: "Alex Smith",
        text: "I can help with the technical investigation if needed.",
        time: "11:35 AM",
        align: "left",
        status: "unread",
      },
      {
        id: 5,
        name: "Emily Davis",
        text: "Update: Issue resolved! It was a cache problem.",
        time: "12:15 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "👍", count: 2 }],
      },
    ],
    g5: [
      {
        id: 1,
        name: "Mike Chen",
        text: "New UI mockups are ready for review.",
        time: "3:15 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "Looks amazing! Love the new color scheme.",
        time: "3:20 PM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Sarah Jamieson",
        text: "The user flow is much cleaner now!",
        time: "3:25 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
      {
        id: 4,
        name: "Mike Chen",
        text: "Thanks! Should we implement this in the next sprint?",
        time: "3:30 PM",
        align: "left",
        status: "unread",
        replies: [
          {
            id: 501,
            name: "You",
            text: "Yes, let's prioritize it.",
            time: "3:31 PM",
            status: "read",
          },
          {
            id: 502,
            name: "Sarah Jamieson",
            text: "I agree, this will improve UX significantly.",
            time: "3:32 PM",
            status: "unread",
          },
        ],
      },
      {
        id: 5,
        name: "You",
        text: "I'll coordinate with the dev team.",
        time: "3:35 PM",
        align: "right",
        status: "read",
      },
    ],
    g6: [
      {
        id: 1,
        name: "Sarah Jamieson",
        text: "Q3 sales numbers are looking good!",
        time: "4:00 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "😮", count: 3 }],
      },
      {
        id: 2,
        name: "You",
        text: "What's the percentage increase from Q2?",
        time: "4:05 PM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Sarah Jamieson",
        text: "We're up 25%! New client acquisitions are strong.",
        time: "4:10 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 4,
        name: "Emily Davis",
        text: "Customer retention rates have also improved significantly.",
        time: "4:15 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 5,
        name: "You",
        text: "Excellent work team! Let's aim for 30% growth in Q4.",
        time: "4:20 PM",
        align: "right",
        status: "read",
        reactions: [{ emoji: "👍", count: 2 }],
      },
    ],
    g7: [
      {
        id: 1,
        name: "Alex Smith",
        text: "Server maintenance scheduled for weekend.",
        time: "5:30 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 2,
        name: "You",
        text: "What time will the downtime start?",
        time: "5:35 PM",
        align: "right",
        status: "read",
      },
      {
        id: 3,
        name: "Alex Smith",
        text: "Saturday 2 AM to 6 AM. I'll send out notifications.",
        time: "5:40 PM",
        align: "left",
        status: "unread",
      },
      {
        id: 4,
        name: "Joe Williams",
        text: "Perfect timing. We can deploy the new version then.",
        time: "5:45 PM",
        align: "left",
        status: "unread",
        replies: [
          {
            id: 701,
            name: "Alex Smith",
            text: "Good idea! I'll coordinate with you.",
            time: "5:46 PM",
            status: "unread",
          },
        ],
      },
      {
        id: 5,
        name: "You",
        text: "Pinned: Maintenance Window - Sat 2-6 AM",
        time: "5:50 PM",
        align: "right",
        status: "read",
        type: "pin",
      },
      {
        id: 6,
        name: "Alex Smith",
        text: "I'll be monitoring throughout the maintenance window.",
        time: "6:00 PM",
        align: "left",
        status: "unread",
        reactions: [{ emoji: "👍", count: 1 }],
      },
    ],
  };

  // Initialize initialMessagesState with the static data
  useEffect(() => {
    if (!initialMessagesState) {
      setInitialMessagesState(initialMessages);
    }
  }, [initialMessagesState]);

  const availableUsers = users;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !favorites.includes(u.id)
  );
  const favoriteUsers = users.filter((u) => favorites.includes(u.id));

  //   const regularUsers = filteredUsers.filter((u) => !favorites.includes(u.id));
  //   console.log(regularUsers);

  const unreadMessages = initialMessagesState
    ? Object.keys(initialMessagesState).flatMap((chatId) => {
        return initialMessagesState[chatId]
          .filter((msg) => msg.status === "unread")
          .map((msg) => ({ chatId, ...msg }));
      })
    : [];

  // Update favicon based on unread messages
  useEffect(() => {
    const updateFavicon = () => {
      const favicon =
        document.querySelector('link[rel="icon"]') ||
        document.querySelector('link[rel="shortcut icon"]');

      if (unreadMessages.length > 0) {
        // Create favicon with red dot
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 32;
        canvas.height = 32;

        // Load the original favicon image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw original favicon
          ctx.drawImage(img, 0, 0, 32, 32);

          // Draw red dot in top-right corner
          ctx.fillStyle = "#ef4444"; // red-500
          ctx.beginPath();
          ctx.arc(26, 6, 6, 0, 2 * Math.PI);
          ctx.fill();

          // Update favicon
          const newFavicon = canvas.toDataURL("image/png");
          if (favicon) {
            favicon.href = newFavicon;
          } else {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = newFavicon;
            document.head.appendChild(link);
          }
        };
        img.src = "/top-logo.png";
      } else {
        // Remove red dot, use original favicon
        if (favicon) {
          favicon.href = "/top-logo.png";
        } else {
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = "/top-logo.png";
          document.head.appendChild(link);
        }
      }
    };

    updateFavicon();
  }, [unreadMessages]);

  // Force scroll to bottom when switching users or opening chat
  useEffect(() => {
    if (activeUser && scrollRef.current && !showThreadsPage) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 200);
    }
  }, [activeUser?.id, showThreadsPage]);

  // Auto-scroll thread to latest reply
  useEffect(() => {
    if (threadScrollRef.current && threadMsg?.replies) {
      setTimeout(() => {
        if (threadScrollRef.current) {
          threadScrollRef.current.scrollTop =
            threadScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [threadMsg?.replies]);

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

  useEffect(() => {
    if (!users.length && !channels.length) return;

    const params = new URLSearchParams(location.search);
    const userNameParam = params.get("user");
    const groupNameParam = params.get("group");

    if (userNameParam) {
      const decoded = userNameParam.trim().toLowerCase();
      const matchedUser = users.find(
        (u) => u.name.trim().toLowerCase() === decoded
      );
      if (matchedUser) {
        setActiveUser(matchedUser);
      }
    } else if (groupNameParam) {
      const decoded = groupNameParam.trim().toLowerCase();
      const matchedGroup = channels.find(
        (g) => g.name.trim().toLowerCase() === decoded
      );
      if (matchedGroup) {
        setActiveUser({ ...matchedGroup, isGroup: true });
      }
    }
  }, [location, users, channels]);

  useEffect(() => {
    const handler = (e) => {
      const name = e.detail.username.trim().toLowerCase();

      const matchedUser = users.find(
        (u) => u.name.trim().toLowerCase() === name
      );
      if (matchedUser) {
        setActiveUser(matchedUser);
        navigate(`/chat?user=${encodeURIComponent(matchedUser.name)}`, {
          replace: false,
        });
        return;
      }

      const matchedGroup = channels.find(
        (g) => g.name.trim().toLowerCase() === name
      );
      if (matchedGroup) {
        setActiveUser({ ...matchedGroup, isGroup: true });
        navigate(`/chat?group=${encodeURIComponent(matchedGroup.name)}`, {
          replace: false,
        });
      }
    };

    window.addEventListener("open-chat-from-notification", handler);
    return () =>
      window.removeEventListener("open-chat-from-notification", handler);
  }, [users, channels, navigate]);

  useEffect(() => {
    // if not a group, clear members
    if (!activeUser?.isGroup) {
      if (groupMembers.length > 0) setGroupMembers([]);
      return;
    }

    // resolve each member id / object -> real user object (use currentUser for "me")
    const resolved = (activeUser.members || [])
      .map((m) => {
        if (!m) return null;
        if (typeof m === "object") return m; // already a user object
        if (m === "me") return currentUser; // map "me" to currentUser object
        return users.find((u) => u.id === m) || null; // find in users array
      })
      .filter(Boolean);

    // ✅ only update if something actually changed
    setGroupMembers((prev) => {
      const sameLength = prev.length === resolved.length;
      const sameItems =
        sameLength && prev.every((p, i) => p?.id === resolved[i]?.id);

      return sameItems ? prev : resolved;
    });
  }, [activeUser, users, currentUser]);

  const handleSend = () => {
    if (
      (!message || !message.trim()) &&
      !attachedFile &&
      !audioBlob &&
      !videoBlob
    )
      return;

    if (!activeUser) return;

    // Stop recordings
    if (isRecordingAudio) setIsRecordingAudio(false);
    if (isRecordingVideo) handleStopVideo();

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const attachments = [];

    if (attachedFile) {
      attachments.push({
        name: attachedFile.name,
        type: attachedFile.type,
        size: attachedFile.size,
        url: URL.createObjectURL(attachedFile),
      });
    }

    if (audioBlob) {
      attachments.push({
        name: `audio-${Date.now()}.webm`,
        type: audioBlob.type,
        size: audioBlob.size,
        url: URL.createObjectURL(audioBlob),
        duration: Math.round(recordingDuration),
      });
    }

    if (videoBlob) {
      attachments.push({
        name: `video-${Date.now()}.webm`,
        type: videoBlob.type,
        size: videoBlob.size,
        url: URL.createObjectURL(videoBlob),
      });
    }

    const newMessage = {
      id: Date.now(),
      text: message || "",
      time: now,
      align: "right",
      name: "You",
      attachments,
    };

    setMessages((prev) => ({
      ...prev,
      [activeUser.id]: {
        ...(prev[activeUser.id] || { messages: [], files: [], pins: [] }),
        messages: [...(prev[activeUser.id]?.messages || []), newMessage],
        files: attachments.length
          ? [...(prev[activeUser.id]?.files || []), ...attachments]
          : prev[activeUser.id]?.files || [],
      },
    }));

    // Reset inputs
    setMessage("");
    setAttachedFile(null);
    setAttachedPreviewUrl(null);
    setAudioBlob(null);
    setVideoBlob(null);
    setRecordingStartTime(null);
    setRecordingDuration(0);
    setRecordingChunks([]);

    if (fileInputRef?.current) fileInputRef.current.value = "";
  };

  const handleEmojiSelect = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleUserClick = (user) => {
    if (!user) return;
    // set UI immediately
    setActiveUser(user);
    setSidebarOpen(false);
    setShowThreadsPage(false);

    // initialize empty messages array for new users to ensure they appear in sidebar
    setMessages((prev) => ({
      ...prev,
      [user.id]: prev[user.id] || { messages: [], files: [], pins: [] },
    }));

    // sync the URL (username-based)
    navigate(`/chat?user=${encodeURIComponent(user.name)}`, { replace: false });
  };

  const handleThreadsClick = () => {
    setShowThreadsPage(true);
    setActiveUser(null);
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

    // Groups use # symbol instead of avatars

    const newGroup = {
      id: newGroupId,
      name: newGroupName,
      members: membersIds,
      isGroup: true,
    };

    // add to channels
    setChannels((prev) => [...prev, newGroup]);

    // ensure we have a messages array for this group (empty)
    setMessages((prev) => ({ ...prev, [newGroupId]: [] }));

    // reset modal state
    setGroupModalOpen(false);
    setNewGroupName("");
    setSelectedMemberIds([]);
    setIsGroupNameEmpty(false);
  };

  const isDuplicateGroupName = channels.some(
    (g) => g.name.trim().toLowerCase() === newGroupName.trim().toLowerCase()
  );

  const sortedUsers = [...users].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const activityRef = useRef(null);
  const fileRef = useRef(null);
  const createPanelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        activityRef.current &&
        !activityRef.current.contains(e.target) &&
        activePanel === "activity"
      ) {
        setActivePanel("home"); // closes the panel
      }
      if (
        fileRef.current &&
        !fileRef.current.contains(e.target) &&
        showFilePanel
      ) {
        setShowFilePanel(false); // closes the file panel
      }
      if (
        createPanelRef.current &&
        !createPanelRef.current.contains(e.target) &&
        showCreatePanel
      ) {
        setShowCreatePanel(false); // closes the create panel
      }
      // Close edit emoji picker when clicking outside
      if (showEditEmojiPicker && !e.target.closest(".emoji-picker-container")) {
        setShowEditEmojiPicker(false);
      }
      // Close message menu when clicking outside
      if (showMessageMenu && !e.target.closest(".message-menu-container")) {
        setShowMessageMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    activePanel,
    setActivePanel,
    showFilePanel,
    showCreatePanel,
    showEditEmojiPicker,
    showMessageMenu,
  ]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (filePanelTimeoutRef.current) {
        clearTimeout(filePanelTimeoutRef.current);
      }
      if (activityPanelTimeoutRef.current) {
        clearTimeout(activityPanelTimeoutRef.current);
      }
    };
  }, []);

  // Initialize notifications with hardcoded data
  useEffect(() => {
    // Hardcoded notifications with explicit status
    const hardcodedNotifications = [
      {
        id: 1,
        type: "message",
        title: "New message from Sarah Jamieson",
        message: "Hey, how are you doing?",
        time: "2:00 PM",
        chatId: 2,
        chatName: "Sarah Jamieson",
        messageId: 1,
        avatar: "/avatar3.png",
        isChannel: false,
        status: "unread",
      },
      {
        id: 2,
        type: "reply",
        title: "John Doe replied to your message",
        message: "Sure, I can help with that!",
        time: "1:45 PM",
        chatId: 1,
        chatName: "John Doe",
        messageId: 2,
        avatar: "/avatar2.png",
        isChannel: false,
        status: "unread",
        originalMessage: "Can someone help me?",
      },
      {
        id: 3,
        type: "mention",
        title: "You were mentioned by Alice",
        message: "Hey @Hasnain, can you help me with this task?",
        time: "1:30 PM",
        chatId: 3,
        chatName: "Alice",
        messageId: 3,
        avatar: "/avatar1.png",
        isChannel: false,
        status: "unread",
      },
      {
        id: 4,
        type: "message",
        title: "New message from General channel",
        message: "Team meeting at 3 PM",
        time: "1:15 PM",
        chatId: "g1",
        chatName: "General",
        messageId: 4,
        avatar: null,
        isChannel: true,
        status: "unread",
      },
      {
        id: 5,
        type: "reply",
        title: "Bob replied to your message",
        message: "That sounds great!",
        time: "1:00 PM",
        chatId: 4,
        chatName: "Bob",
        messageId: 5,
        avatar: "/avatar4.png",
        isChannel: false,
        status: "read",
        originalMessage: "What do you think?",
      },
      {
        id: 6,
        type: "message",
        title: "New message from Charlie",
        message: "Thanks for the update",
        time: "12:45 PM",
        chatId: 5,
        chatName: "Charlie",
        messageId: 6,
        avatar: "/avatar5.png",
        isChannel: false,
        status: "read",
      },
    ];

    setNotifications(hardcodedNotifications);

    // Mark notifications with status "read" in the readNotificationIds set
    const preReadIds = hardcodedNotifications
      .filter((n) => n.status === "read")
      .map((n) => n.id);
    setReadNotificationIds(new Set(preReadIds));
  }, []);

  const normalizeMessages = (rawMessages) => {
    const normalized = {};
    for (const [id, msgs] of Object.entries(rawMessages)) {
      normalized[id] = {
        messages: msgs.filter((m) => !m.type), // regular messages
        files: msgs.filter((m) => m.type === "file"),
        pins: msgs.filter((m) => m.type === "pin"),
      };
    }
    return normalized;
  };

  // 🔹 Example usage
  const [messages, setMessages] = useState(() =>
    normalizeMessages(initialMessages)
  );

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current && !showThreadsPage) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, activeUser, showThreadsPage]);

  // Regular users filter - must be after messages state is defined
  const regularUsers = users.filter(
    (u) =>
      !favorites.includes(u.id) &&
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (messages[u.id] ||
        (initialMessages[u.id] && initialMessages[u.id].length > 0)) // ✅ show if user has messages in current state OR in initial data
  );

  // Keep the thread panel's message fresh when messages update
  useEffect(() => {
    if (threadOpen && threadMsg && activeUser) {
      const msgsArr =
        messages?.[activeUser.id]?.messages || messages?.[activeUser.id] || [];
      const updated = (msgsArr || []).find((m) => m.id === threadMsg.id);
      if (updated) setThreadMsg(updated);
    }
  }, [messages, threadOpen, activeUser?.id]);

  // ✅ Add reaction
  const handleAddReaction = (userId, msgId, emoji) => {
    setMessages((prev) => {
      const updated = { ...prev };

      const msgsArr = Array.isArray(updated[userId])
        ? [...updated[userId]]
        : Array.isArray(updated[userId]?.messages)
        ? [...updated[userId].messages]
        : [];

      const newMsgs = msgsArr.map((m) => {
        if (m.id === msgId) {
          let newReactions;

          if (activeUser?.isGroup) {
            // ✅ Group chat → allow multiple reactions
            const existing = (m.reactions || []).find((r) => r.emoji === emoji);
            if (existing) {
              newReactions = (m.reactions || []).map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              );
            } else {
              newReactions = [...(m.reactions || []), { emoji, count: 1 }];
            }
          } else {
            // ✅ 1-to-1 chat → replace previous with only the new one
            newReactions = [{ emoji, count: 1 }];
          }

          return { ...m, reactions: newReactions };
        }
        return m;
      });

      if (Array.isArray(updated[userId])) {
        updated[userId] = newMsgs;
      } else {
        updated[userId] = { ...(updated[userId] || {}), messages: newMsgs };
      }

      return updated;
    });

    try {
      setShowEmojiPicker(null);
    } catch (e) {
      /* ignore if not using the same state */
    }
  };

  // ✅ Remove reaction
  const handleRemoveReaction = (userId, msgId, emoji) => {
    setMessages((prev) => {
      const updated = { ...prev };

      const msgsArr = Array.isArray(updated[userId])
        ? [...updated[userId]]
        : Array.isArray(updated[userId]?.messages)
        ? [...updated[userId].messages]
        : [];

      const newMsgs = msgsArr.map((m) => {
        if (m.id === msgId) {
          let newReactions;

          if (activeUser?.isGroup) {
            // ✅ Group chat → decrement count, remove if 0
            newReactions = (m.reactions || [])
              .map((r) =>
                r.emoji === emoji ? { ...r, count: r.count - 1 } : r
              )
              .filter((r) => r.count > 0);
          } else {
            // ✅ 1-to-1 chat → just clear reactions
            newReactions = [];
          }

          return { ...m, reactions: newReactions };
        }
        return m;
      });

      if (Array.isArray(updated[userId])) {
        updated[userId] = newMsgs;
      } else {
        updated[userId] = { ...(updated[userId] || {}), messages: newMsgs };
      }

      return updated;
    });
  };

  // Open thread panel instead of inline reply box
  const openReplyBox = (msgId) => {
    // Open thread panel for this message
    openThread(msgId);
  };

  // Submit a reply (adds to message.replies)
  const handleSubmitReply = (userId, msgId, text, attachments = []) => {
    if ((!text || !text.trim()) && attachments.length === 0) return;
    const trimmed = text ? text.trim() : "";

    setMessages((prev) => {
      const updated = { ...prev };

      const msgsArr = Array.isArray(updated[userId])
        ? [...updated[userId]]
        : Array.isArray(updated[userId]?.messages)
        ? [...updated[userId].messages]
        : [];

      const newMsgs = msgsArr.map((m) => {
        if (m.id === msgId) {
          const newReply = {
            id: Date.now(),
            name: currentUser?.name || "You",
            text: trimmed,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            attachments: attachments.length > 0 ? attachments : undefined,
          };
          return { ...m, replies: [...(m.replies || []), newReply] };
        }
        return m;
      });

      if (Array.isArray(updated[userId])) {
        updated[userId] = newMsgs;
      } else {
        updated[userId] = { ...(updated[userId] || {}), messages: newMsgs };
      }

      return updated;
    });

    // close inline reply box and clear
    setReplyBoxForMsgId(null);
    setReplyText("");

    // if thread panel is open for same msg, ensure it refreshes (useEffect will sync)
  };

  // Open thread panel for a message id
  const openThread = (msgId) => {
    const msgsArr =
      messages?.[activeUser?.id]?.messages || messages?.[activeUser?.id] || [];
    const m = (msgsArr || []).find((x) => x.id === msgId);
    if (m) {
      setThreadMsg(m);
      setThreadOpen(true);
      setTimeout(() => threadReplyInputRef.current?.focus(), 80);
      // Scroll thread to bottom when opening
      setTimeout(() => {
        if (threadScrollRef.current) {
          threadScrollRef.current.scrollTop =
            threadScrollRef.current.scrollHeight;
        }
      }, 300);
    }
  };

  // Close thread
  const closeThread = () => {
    setThreadOpen(false);
    setThreadMsg(null);
    setThreadReplyText("");
    setThreadShowEmojiPicker(false);
    setThreadShowMentionList(false);
    setThreadMentionSearch("");
    setThreadAttachedFile(null);
    setThreadAttachedPreviewUrl(null);
    // Reset recording states
    setThreadIsRecordingAudio(false);
    setThreadIsRecordingVideo(false);
    setThreadIsPaused(false);
    setThreadAudioBlob(null);
    setThreadVideoBlob(null);
    threadMediaRecorderRef.current = null;
    // Reset edit states
    setEditingReplyId(null);
    setEditingReplyText("");
    setHoveredReplyId(null);
    setShowReplyMenu(null);
    setShowEditEmojiPicker(false);
  };

  // Thread emoji picker handler
  const handleThreadEmojiSelect = (emojiData) => {
    if (threadQuillRef.current) {
      const quill = threadQuillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, emojiData.emoji);
      } else {
        quill.insertText(quill.getLength() - 1, emojiData.emoji);
      }
    }
    setThreadShowEmojiPicker(false);
  };

  // Thread mention handler
  const handleThreadSelectMention = (member) => {
    if (threadQuillRef.current) {
      const quill = threadQuillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();

      // Find the last @ and replace it with the mention
      const text = quill.getText();
      const lastAtIndex = text.lastIndexOf("@", index - 1);

      if (lastAtIndex >= 0) {
        // Replace from @ to current position with the mention
        quill.deleteText(lastAtIndex, index - lastAtIndex);
        quill.insertText(lastAtIndex, `@${member.name} `);
        quill.setSelection(lastAtIndex + member.name.length + 2);
      } else {
        // Fallback: insert at current position
        quill.insertText(index, `@${member.name} `);
        quill.setSelection(index + member.name.length + 2);
      }
    }
    setThreadShowMentionList(false);
    setThreadMentionSearch("");
  };

  // Thread send handler
  const handleThreadSend = () => {
    if (threadQuillRef.current && threadMsg) {
      const quill = threadQuillRef.current.getEditor();
      const htmlContent = quill.root.innerHTML.trim();
      const plainText = quill.getText().trim();

      // Check if we have any content to send
      if (
        !plainText &&
        !threadAttachedFile &&
        !threadAudioBlob &&
        !threadVideoBlob
      ) {
        return;
      }

      // Prepare attachments array
      const attachments = [];

      // Add file attachment
      if (threadAttachedFile) {
        attachments.push({
          name: threadAttachedFile.name,
          type: threadAttachedFile.type,
          size: threadAttachedFile.size,
          url: URL.createObjectURL(threadAttachedFile),
        });
      }

      // Add audio attachment
      if (threadAudioBlob) {
        attachments.push({
          name: `audio-${Date.now()}.webm`,
          type: threadAudioBlob.type,
          size: threadAudioBlob.size,
          url: URL.createObjectURL(threadAudioBlob),
          duration: Math.round(recordingDuration || 0),
        });
      }

      // Add video attachment
      if (threadVideoBlob) {
        attachments.push({
          name: `video-${Date.now()}.webm`,
          type: threadVideoBlob.type,
          size: threadVideoBlob.size,
          url: URL.createObjectURL(threadVideoBlob),
        });
      }

      const replyText = htmlContent || "";
      handleSubmitReply(activeUser.id, threadMsg.id, replyText, attachments);

      // Clear all thread input states
      setThreadReplyText("");
      quill.setText("");
      setThreadAttachedFile(null);
      setThreadAttachedPreviewUrl(null);
      setThreadAudioBlob(null);
      setThreadVideoBlob(null);
    }
  };

  // Thread Audio Recording Handlers
  const handleThreadStartAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setThreadAudioBlob(blob);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      threadMediaRecorderRef.current = { recorder, chunks, stream };
      setThreadIsRecordingAudio(true);
      setThreadIsPaused(false);
    } catch (err) {
      console.error("Thread audio recording error:", err);
    }
  };

  const handleThreadPauseResumeAudio = () => {
    if (threadMediaRecorderRef.current?.recorder) {
      if (threadIsPaused) {
        threadMediaRecorderRef.current.recorder.resume();
        setThreadIsPaused(false);
      } else {
        threadMediaRecorderRef.current.recorder.pause();
        setThreadIsPaused(true);
      }
    }
  };

  const handleThreadStopAudio = () => {
    if (threadMediaRecorderRef.current?.recorder) {
      threadMediaRecorderRef.current.recorder.stop();
      setThreadIsRecordingAudio(false);
      setThreadIsPaused(false);
    }
  };

  // Thread Video Recording Handlers
  const handleThreadStartVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "video/webm" });
          setThreadVideoBlob(blob);
        }
        stream.getTracks().forEach((t) => t.stop());
        if (threadVideoRef.current) {
          threadVideoRef.current.srcObject = null;
        }
      };

      recorder.start();
      threadMediaRecorderRef.current = { recorder, chunks, stream };
      setThreadIsRecordingVideo(true);

      // Set up video preview
      setTimeout(() => {
        if (threadVideoRef.current) {
          threadVideoRef.current.srcObject = stream;
          threadVideoRef.current.muted = true;
          threadVideoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Thread video recording error:", err);
    }
  };

  const handleThreadStopVideo = () => {
    if (threadMediaRecorderRef.current?.recorder) {
      threadMediaRecorderRef.current.recorder.stop();
      setThreadIsRecordingVideo(false);
    }
  };

  // Thread Reply Edit/Delete Handlers
  const handleEditReply = (replyId, currentText) => {
    setEditingReplyId(replyId);
    setEditingReplyText(currentText);
    setShowReplyMenu(null);
    setTimeout(() => {
      if (editReplyQuillRef.current) {
        const quill = editReplyQuillRef.current.getEditor();
        quill.root.innerHTML = currentText;
        quill.focus();
      }
    }, 100);
  };

  const handleSaveEditReply = () => {
    if (!editReplyQuillRef.current || !editingReplyId || !threadMsg) return;

    const quill = editReplyQuillRef.current.getEditor();
    const htmlContent = quill.root.innerHTML.trim();
    const plainText = quill.getText().trim();

    if (!plainText) return;

    setMessages((prev) => {
      const updated = { ...prev };
      const msgsArr = Array.isArray(updated[activeUser.id])
        ? [...updated[activeUser.id]]
        : Array.isArray(updated[activeUser.id]?.messages)
        ? [...updated[activeUser.id].messages]
        : [];

      const newMsgs = msgsArr.map((m) => {
        if (m.id === threadMsg.id) {
          const updatedReplies = (m.replies || []).map((r) => {
            if (r.id === editingReplyId) {
              return { ...r, text: htmlContent };
            }
            return r;
          });
          return { ...m, replies: updatedReplies };
        }
        return m;
      });

      if (Array.isArray(updated[activeUser.id])) {
        updated[activeUser.id] = newMsgs;
      } else {
        updated[activeUser.id] = {
          ...(updated[activeUser.id] || {}),
          messages: newMsgs,
        };
      }

      return updated;
    });

    // Update thread message state
    setThreadMsg((prev) => {
      if (!prev) return prev;
      const updatedReplies = (prev.replies || []).map((r) => {
        if (r.id === editingReplyId) {
          return { ...r, text: htmlContent };
        }
        return r;
      });
      return { ...prev, replies: updatedReplies };
    });

    setEditingReplyId(null);
    setEditingReplyText("");
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditingReplyText("");
    setShowEditEmojiPicker(false);
  };

  const handleDeleteReply = (replyId) => {
    if (!threadMsg) return;

    setMessages((prev) => {
      const updated = { ...prev };
      const msgsArr = Array.isArray(updated[activeUser.id])
        ? [...updated[activeUser.id]]
        : Array.isArray(updated[activeUser.id]?.messages)
        ? [...updated[activeUser.id].messages]
        : [];

      const newMsgs = msgsArr.map((m) => {
        if (m.id === threadMsg.id) {
          const updatedReplies = (m.replies || []).filter(
            (r) => r.id !== replyId
          );
          return { ...m, replies: updatedReplies };
        }
        return m;
      });

      if (Array.isArray(updated[activeUser.id])) {
        updated[activeUser.id] = newMsgs;
      } else {
        updated[activeUser.id] = {
          ...(updated[activeUser.id] || {}),
          messages: newMsgs,
        };
      }

      return updated;
    });

    // Update thread message state
    setThreadMsg((prev) => {
      if (!prev) return prev;
      const updatedReplies = (prev.replies || []).filter(
        (r) => r.id !== replyId
      );
      return { ...prev, replies: updatedReplies };
    });

    setShowReplyMenu(null);
  };

  // Handle emoji selection for edit mode
  const handleEditEmojiSelect = (emojiData) => {
    if (editReplyQuillRef.current) {
      const quill = editReplyQuillRef.current.getEditor();
      const currentText = quill.getText().trim();

      // If the text is empty or only contains whitespace, replace with emoji
      if (currentText === "") {
        quill.setText(emojiData.emoji);
      } else {
        // Otherwise, add emoji at cursor position
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, emojiData.emoji);
        } else {
          quill.insertText(quill.getLength() - 1, emojiData.emoji);
        }
      }
    }
    setShowEditEmojiPicker(false);
  };

  // Handle emoji selection for main message edit mode
  const handleEditMessageEmojiSelect = (emojiData) => {
    if (editMessageQuillRef.current) {
      const quill = editMessageQuillRef.current.getEditor();
      const currentText = quill.getText().trim();

      // If the text is empty or only contains whitespace, replace with emoji
      if (currentText === "") {
        quill.setText(emojiData.emoji);
      } else {
        // Otherwise, add emoji at cursor position
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, emojiData.emoji);
        } else {
          quill.insertText(quill.getLength() - 1, emojiData.emoji);
        }
      }
    }
    setShowEditEmojiPicker(false);
  };

  // Handle message editing
  const handleEditMessage = (msgId) => {
    const msg = (messages[activeUser.id]?.messages || []).find(
      (m) => m.id === msgId
    );
    if (msg) {
      setEditingMessageId(msgId);
      setEditingMessageText(msg.text);
      setShowMessageMenu(null);
    }
  };

  const handleSaveEditMessage = () => {
    if (!editingMessageId) return;

    setMessages((prev) => {
      const updated = { ...prev };
      const msgsArr = Array.isArray(updated[activeUser.id])
        ? [...updated[activeUser.id]]
        : Array.isArray(updated[activeUser.id]?.messages)
        ? [...updated[activeUser.id].messages]
        : [];

      const newMsgs = msgsArr.map((m) =>
        m.id === editingMessageId ? { ...m, text: editingMessageText } : m
      );

      if (Array.isArray(updated[activeUser.id])) {
        updated[activeUser.id] = newMsgs;
      } else {
        updated[activeUser.id] = {
          ...(updated[activeUser.id] || {}),
          messages: newMsgs,
        };
      }

      return updated;
    });

    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const handleDeleteMessage = (msgId) => {
    setMessages((prev) => {
      const updated = { ...prev };
      const msgsArr = Array.isArray(updated[activeUser.id])
        ? [...updated[activeUser.id]]
        : Array.isArray(updated[activeUser.id]?.messages)
        ? [...updated[activeUser.id].messages]
        : [];

      const newMsgs = msgsArr.filter((m) => m.id !== msgId);

      if (Array.isArray(updated[activeUser.id])) {
        updated[activeUser.id] = newMsgs;
      } else {
        updated[activeUser.id] = {
          ...(updated[activeUser.id] || {}),
          messages: newMsgs,
        };
      }

      return updated;
    });

    setShowMessageMenu(null);
  };

  // Add / replace this in your ChatPanel component (near your other handlers)
  const handlePinMessage = (userId, msg) => {
    setMessages((prev) => {
      // clone prev
      const updated = { ...prev };

      // ensure conversation object shape exists
      const convo = {
        ...(updated[userId] || { messages: [], files: [], pins: [] }),
      };

      // ensure pins array exists
      convo.pins = Array.isArray(convo.pins) ? [...convo.pins] : [];

      // avoid duplicate pins: if a pin with same id exists, don't add
      const alreadyPinned = convo.pins.find((p) => p && p.id === msg.id);
      if (!alreadyPinned) {
        // deep copy of msg to avoid accidental mutation
        const pinObj = { ...msg };

        // ensure attachments array is a copy (so later changes don't mutate pin)
        if (Array.isArray(pinObj.attachments)) {
          pinObj.attachments = pinObj.attachments.map((a) => ({ ...a }));
        } else {
          pinObj.attachments = pinObj.attachments
            ? [...pinObj.attachments]
            : [];
        }

        convo.pins = [...convo.pins, pinObj];
      }

      updated[userId] = convo;
      return updated;
    });
  };

  //remove pin
  const handleUnpinMessage = (userId, msgId) => {
    setMessages((prev) => {
      const updated = { ...(prev || {}) };
      const convo = {
        ...(updated[userId] || { messages: [], files: [], pins: [] }),
      };

      convo.pins = Array.isArray(convo.pins)
        ? convo.pins.filter((p) => p && p.id !== msgId)
        : [];

      updated[userId] = convo;
      return updated;
    });
  };

  // create + revoke preview URL while user is previewing (avoids leaks)
  useEffect(() => {
    if (!attachedFile) {
      setAttachedPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(attachedFile);
    setAttachedPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setAttachedPreviewUrl(null);
    };
  }, [attachedFile]);

  // Get all files from all chats
  const getAllFiles = () => {
    const allFiles = [];

    Object.entries(messages || {}).forEach(([chatId, chatData]) => {
      if (chatData?.files) {
        chatData.files.forEach((file, index) => {
          if (file) {
            // Find the chat name
            let chatName = "Unknown Chat";
            if (chatId) {
              const user = users.find((u) => u.id === parseInt(chatId));
              const channel = channels.find((c) => c.id === chatId);
              if (user) chatName = user.name;
              else if (channel) chatName = channel.name;
            }

            // Find the message that contains this file
            const messageWithFile = chatData.messages?.find((msg) =>
              msg.attachments?.some(
                (att) => att.name === file.name && att.size === file.size
              )
            );

            allFiles.push({
              ...file,
              chatId,
              chatName,
              fileId: `${chatId}-${index}`,
              uploadedBy: "You", // Since we're tracking files sent by current user
              messageId: messageWithFile?.id,
              messageTime: messageWithFile?.time,
            });
          }
        });
      }
    });

    // Sort by most recent first (assuming files are added in chronological order)
    return allFiles.reverse();
  };

  // Classify files by time periods
  const getFilesByTimePeriod = () => {
    const allFiles = getAllFiles();
    const now = new Date();

    const classifyFile = (file) => {
      if (!file.messageId) return "previous";

      // Use message ID as a proxy for recency (higher ID = more recent)
      const currentTime = Date.now();
      const timeDiff = currentTime - file.messageId;

      if (timeDiff < 24 * 60 * 60 * 1000) {
        // Less than 24 hours
        return "today";
      } else if (timeDiff < 2 * 24 * 60 * 60 * 1000) {
        // Less than 48 hours
        return "yesterday";
      } else if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
        // Less than 1 week
        return "1week";
      } else if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
        // Less than 1 month
        return "1month";
      } else {
        return "previous";
      }
    };

    const classified = {
      today: [],
      yesterday: [],
      "1week": [],
      "1month": [],
      previous: [],
    };

    allFiles.forEach((file) => {
      const period = classifyFile(file);
      classified[period].push(file);
    });

    return classified;
  };

  // Get unread notification count
  const getUnreadNotificationCount = () => {
    // A notification is unread if it's not in the readNotificationIds set
    const unreadCount = notifications.filter(
      (notif) => !readNotificationIds.has(notif.id)
    ).length;
    console.log(
      "Unread count:",
      unreadCount,
      "Total notifications:",
      notifications.length,
      "Read IDs:",
      Array.from(readNotificationIds)
    );
    return unreadCount;
  };

  // Get all messages with replies for threads page
  const getAllMessagesWithReplies = () => {
    const messagesWithReplies = [];

    Object.entries(messages || {}).forEach(([chatId, chatData]) => {
      const messagesArray = chatData?.messages || [];

      messagesArray.forEach((message) => {
        if (message.replies && message.replies.length > 0) {
          // Find chat name
          let chatName = "Unknown Chat";
          if (chatId) {
            const user = users.find((u) => u.id === parseInt(chatId));
            const channel = channels.find((c) => c.id === chatId);
            if (user) chatName = user.name;
            else if (channel) chatName = channel.name;
          }

          messagesWithReplies.push({
            ...message,
            chatId: chatId, // Keep as string for channels like "g7"
            chatName: chatName,
            chatType: users.find((u) => u.id === parseInt(chatId))
              ? "user"
              : "channel",
          });
        }
      });
    });

    // Sort by most recent first
    return messagesWithReplies.sort((a, b) => b.time - a.time);
  };

  // Get unread replies count
  const getUnreadRepliesCount = () => {
    let unreadCount = 0;

    Object.entries(messages || {}).forEach(([chatId, chatData]) => {
      const messagesArray = chatData?.messages || [];

      messagesArray.forEach((message) => {
        if (message.replies && message.replies.length > 0) {
          message.replies.forEach((reply) => {
            if (reply.status === "unread") {
              unreadCount++;
            }
          });
        }
      });
    });

    return unreadCount;
  };

  // Mark reply as read
  const markReplyAsRead = (chatId, messageId, replyId) => {
    setMessages((prev) => {
      const updated = { ...prev };
      // Handle both string and numeric chatIds
      const chatKey = typeof chatId === "number" ? chatId.toString() : chatId;
      const messagesArray = updated[chatKey]?.messages || [];

      const newMessages = messagesArray.map((message) => {
        if (message.id === messageId && message.replies) {
          const updatedReplies = message.replies.map((reply) => {
            if (reply.id === replyId && reply.status === "unread") {
              return { ...reply, status: "read" };
            }
            return reply;
          });
          return { ...message, replies: updatedReplies };
        }
        return message;
      });

      updated[chatKey] = {
        ...updated[chatKey],
        messages: newMessages,
      };

      return updated;
    });
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    setReadNotificationIds((prev) => {
      const newSet = new Set([...prev, notificationId]);
      console.log("Updated readNotificationIds:", Array.from(newSet));
      return newSet;
    });
  };

  // Helper functions for threads page reply management
  const getThreadsPageReplyKey = (messageId) => `${messageId}`;

  const getThreadsPageReplyText = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    return threadsPageReplyTexts[key] || "";
  };

  const setThreadsPageReplyText = (messageId, text) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageReplyTexts((prev) => ({ ...prev, [key]: text }));
  };

  const toggleThreadsPageEmojiPicker = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageShowEmojiPickers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleThreadsPageEmojiSelect = (messageId, emojiData) => {
    const key = getThreadsPageReplyKey(messageId);
    const currentText = getThreadsPageReplyText(messageId);
    setThreadsPageReplyTexts((prev) => ({
      ...prev,
      [key]: currentText + emojiData.emoji,
    }));
    setThreadsPageShowEmojiPickers((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  // Helper function to get group members for a specific chat
  const getGroupMembersForChat = (chatId) => {
    // Find the channel/group by chatId
    const channel = channels.find((c) => c.id === chatId);
    if (!channel) return [];

    // Resolve each member id to real user object (use currentUser for "me")
    const resolved = (channel.members || [])
      .map((m) => {
        if (!m) return null;
        if (typeof m === "object") return m; // already a user object
        if (m === "me") return currentUser; // map "me" to currentUser object
        return users.find((u) => u.id === m) || null; // find in users array
      })
      .filter(Boolean);

    return resolved;
  };

  const handleThreadsPageSelectMention = (member, messageId) => {
    const key = getThreadsPageReplyKey(messageId);

    // Get the ReactQuill editor instance for this specific message
    const quillEditor = threadsPageQuillRefs.current[key];
    if (quillEditor) {
      const quill = quillEditor.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();

      // Find the last @ and replace it with the mention
      const text = quill.getText();
      const lastAtIndex = text.lastIndexOf("@", index - 1);

      if (lastAtIndex >= 0) {
        // Replace from @ to current position with the mention
        quill.deleteText(lastAtIndex, index - lastAtIndex);
        quill.insertText(lastAtIndex, `@${member.name} `);
        quill.setSelection(lastAtIndex + member.name.length + 2);
      } else {
        // Fallback: insert at current position
        quill.insertText(index, `@${member.name} `);
        quill.setSelection(index + member.name.length + 2);
      }
    } else {
      // Fallback to string manipulation if ReactQuill is not available
      const currentText = getThreadsPageReplyText(messageId);
      const lastAtIndex = currentText.lastIndexOf("@");
      if (lastAtIndex >= 0) {
        const newText =
          currentText.substring(0, lastAtIndex) + `@${member.name} `;
        setThreadsPageReplyText(messageId, newText);
      } else {
        setThreadsPageReplyText(messageId, currentText + `@${member.name} `);
      }
    }

    setThreadsPageShowMentionLists((prev) => ({
      ...prev,
      [key]: false,
    }));
    setThreadsPageMentionSearches((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleThreadsPageSubmitReply = (message) => {
    const replyText = getThreadsPageReplyText(message.id);
    if (
      replyText.trim() ||
      threadsPageAttachedFiles[getThreadsPageReplyKey(message.id)] ||
      threadsPageAudioBlobs[getThreadsPageReplyKey(message.id)] ||
      threadsPageVideoBlobs[getThreadsPageReplyKey(message.id)]
    ) {
      const attachments = [];

      // Add file attachment if exists
      if (threadsPageAttachedFiles[getThreadsPageReplyKey(message.id)]) {
        attachments.push(
          threadsPageAttachedFiles[getThreadsPageReplyKey(message.id)]
        );
      }

      // Add audio attachment if exists
      if (threadsPageAudioBlobs[getThreadsPageReplyKey(message.id)]) {
        attachments.push({
          name: "voice-message.webm",
          type: "audio/webm",
          url: URL.createObjectURL(
            threadsPageAudioBlobs[getThreadsPageReplyKey(message.id)]
          ),
          duration:
            threadsPageRecordingDuration[getThreadsPageReplyKey(message.id)] ||
            0,
        });
      }

      // Add video attachment if exists
      if (threadsPageVideoBlobs[getThreadsPageReplyKey(message.id)]) {
        attachments.push({
          name: "video-message.webm",
          type: "video/webm",
          url: URL.createObjectURL(
            threadsPageVideoBlobs[getThreadsPageReplyKey(message.id)]
          ),
        });
      }

      handleSubmitReply(message.chatId, message.id, replyText, attachments);

      // Clear all reply data
      const key = getThreadsPageReplyKey(message.id);
      setThreadsPageReplyText(message.id, "");
      setThreadsPageAttachedFiles((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setThreadsPageAttachedPreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setThreadsPageAudioBlobs((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setThreadsPageVideoBlobs((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setThreadsPageRecordingDuration((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setThreadsPageIsPaused((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  // Voice and video recording handlers for threads page
  const handleThreadsPageStartAudio = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageIsRecordingAudio((prev) => ({ ...prev, [key]: true }));
    setThreadsPageIsPaused((prev) => ({ ...prev, [key]: false }));
    setThreadsPageRecordingDuration((prev) => ({ ...prev, [key]: 0 }));

    // Start recording logic (similar to main thread recording)
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        setThreadsPageAudioBlobs((prev) => ({ ...prev, [key]: audioBlob }));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      // Store media recorder reference for stopping
      window[`threadsPageMediaRecorder_${key}`] = mediaRecorder;

      // Start duration timer
      const interval = setInterval(() => {
        setThreadsPageRecordingDuration((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));
      }, 1000);

      window[`threadsPageRecordingInterval_${key}`] = interval;
    });
  };

  const handleThreadsPageStopAudio = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageIsRecordingAudio((prev) => ({ ...prev, [key]: false }));

    const mediaRecorder = window[`threadsPageMediaRecorder_${key}`];
    const interval = window[`threadsPageRecordingInterval_${key}`];

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    if (interval) {
      clearInterval(interval);
      delete window[`threadsPageRecordingInterval_${key}`];
    }
  };

  const handleThreadsPagePauseResumeAudio = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageIsPaused((prev) => ({ ...prev, [key]: !prev[key] }));

    const mediaRecorder = window[`threadsPageMediaRecorder_${key}`];
    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
      } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
      }
    }
  };

  const handleThreadsPageStartVideo = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageIsRecordingVideo((prev) => ({ ...prev, [key]: true }));

    // Start video recording logic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const videoChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          videoChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(videoChunks, { type: "video/webm" });
          setThreadsPageVideoBlobs((prev) => ({ ...prev, [key]: videoBlob }));
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();

        // Store media recorder reference for stopping
        window[`threadsPageVideoRecorder_${key}`] = mediaRecorder;
      });
  };

  const handleThreadsPageStopVideo = (messageId) => {
    const key = getThreadsPageReplyKey(messageId);
    setThreadsPageIsRecordingVideo((prev) => ({ ...prev, [key]: false }));

    const mediaRecorder = window[`threadsPageVideoRecorder_${key}`];
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    markNotificationAsRead(notification.id);

    // Navigate to the appropriate chat and message
    if (notification.type === "message" || notification.type === "mention") {
      // Parse chatId for users (it's a string from Object.entries)
      const user = users.find((u) => u.id === parseInt(notification.chatId));
      const channel = channels.find((c) => c.id === notification.chatId);

      if (user) {
        setActiveUser(user);
        navigate(`/chat?user=${encodeURIComponent(user.name)}`, {
          replace: false,
        });
      } else if (channel) {
        setActiveUser({ ...channel, isGroup: true });
        navigate(`/chat?group=${encodeURIComponent(channel.name)}`, {
          replace: false,
        });
      }

      // Highlight the specific message after navigation
      if (notification.messageId) {
        setTimeout(() => {
          setHighlightedMessageId(notification.messageId);
          setTimeout(() => {
            setHighlightedMessageId(null);
          }, 3000);
        }, 500);
      }
    } else if (
      notification.type === "reaction" ||
      notification.type === "reply"
    ) {
      // Parse chatId for users (it's a string from Object.entries)
      const user = users.find((u) => u.id === parseInt(notification.chatId));
      const channel = channels.find((c) => c.id === notification.chatId);

      if (user) {
        setActiveUser(user);
        navigate(`/chat?user=${encodeURIComponent(user.name)}`, {
          replace: false,
        });
      } else if (channel) {
        setActiveUser({ ...channel, isGroup: true });
        navigate(`/chat?group=${encodeURIComponent(channel.name)}`, {
          replace: false,
        });
      }

      // For reply notifications, open the thread panel
      if (notification.type === "reply" && notification.messageId) {
        // Wait for the chat to load, then open thread and highlight
        setTimeout(() => {
          const msgsArr =
            messages?.[notification.chatId]?.messages ||
            messages?.[notification.chatId] ||
            [];
          const msg = (msgsArr || []).find(
            (m) => m.id === notification.messageId
          );
          if (msg) {
            setThreadMsg(msg);
            setThreadOpen(true);

            // Highlight the reply message
            setTimeout(() => {
              setHighlightedMessageId(notification.messageId);
              setTimeout(() => {
                setHighlightedMessageId(null);
              }, 3000);
            }, 200);
          }
        }, 500);
      } else if (notification.messageId) {
        // Highlight for reaction notifications
        setTimeout(() => {
          setHighlightedMessageId(notification.messageId);
          setTimeout(() => {
            setHighlightedMessageId(null);
          }, 3000);
        }, 500);
      }
    }

    // Close the activity panel and threads page
    setActivePanel("home");
    setShowThreadsPage(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Scroll to highlighted message when it changes
  useEffect(() => {
    if (highlightedMessageId) {
      // Wait for the message to render
      setTimeout(() => {
        const messageElement = document.querySelector(
          `[data-message-id="${highlightedMessageId}"]`
        );
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  }, [highlightedMessageId]);

  // Update browser tab title and favicon based on unread notifications
  useEffect(() => {
    const originalTitle = "Markeltree Dashboard"; // Use a fixed original title
    const unreadCount = getUnreadNotificationCount();

    console.log("useEffect triggered - Dispatching unread count:", unreadCount);

    // Always use the original title without the unread count
    document.title = originalTitle;

    // Dispatch custom event to update sidebar unread count
    window.dispatchEvent(
      new CustomEvent("updateUnreadCount", {
        detail: { count: unreadCount },
      })
    );

    // Store in localStorage so it persists across page navigations
    localStorage.setItem("unreadNotificationCount", unreadCount.toString());

    // Update favicon based on unread notifications
    const updateFavicon = () => {
      const favicon =
        document.querySelector('link[rel="icon"]') ||
        document.querySelector('link[rel="shortcut icon"]');

      if (unreadCount > 0) {
        // Create favicon with red dot
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 32;
        canvas.height = 32;

        // Load the original favicon image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw original favicon
          ctx.drawImage(img, 0, 0, 32, 32);

          // Draw red dot in top-right corner
          ctx.fillStyle = "#ef4444"; // red-500
          ctx.beginPath();
          ctx.arc(26, 6, 6, 0, 2 * Math.PI);
          ctx.fill();

          // Update favicon
          const newFavicon = canvas.toDataURL("image/png");
          if (favicon) {
            favicon.href = newFavicon;
          } else {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = newFavicon;
            document.head.appendChild(link);
          }
        };
        img.src = "/top-logo.png";
      } else {
        // Remove red dot, use original favicon
        if (favicon) {
          favicon.href = "/top-logo.png";
        } else {
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = "/top-logo.png";
          document.head.appendChild(link);
        }
      }
    };

    updateFavicon();

    return () => {
      document.title = originalTitle;
    };
  }, [notifications, readNotificationIds]);

  // File navigation - navigate to chat where file was sent
  const handleFileClick = (file) => {
    if (!file?.chatId) return;

    const user = users.find((u) => u.id === parseInt(file.chatId));
    const channel = channels.find((c) => c.id === file.chatId);

    if (user) {
      setActiveUser(user);
      navigate(`/chat?user=${encodeURIComponent(user.name)}`, {
        replace: false,
      });
    } else if (channel) {
      setActiveUser({ ...channel, isGroup: true });
      navigate(`/chat?group=${encodeURIComponent(channel.name)}`, {
        replace: false,
      });
    }

    // Highlight the specific message containing this file
    if (file.messageId) {
      setHighlightedFileId(file.messageId);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedFileId(null);
      }, 3000);
    }

    // Close the file panel and threads page
    setShowFilePanel(false);
    setShowThreadsPage(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  //Activity navigation
  const handleActivityClick = (msg) => {
    if (!msg?.name) return;

    // Mark the message as read
    if (initialMessagesState && msg.chatId && msg.id) {
      setInitialMessagesState((prev) => {
        const newState = { ...prev };
        if (newState[msg.chatId]) {
          newState[msg.chatId] = newState[msg.chatId].map((message) =>
            message.id === msg.id ? { ...message, status: "read" } : message
          );
        }
        return newState;
      });
    }

    // Check if this is a channel/group message by chatId
    const channelData = channels.find((ch) => ch.id === msg.chatId);

    if (channelData) {
      // This is a channel/group message
      setActiveUser({ ...channelData, isGroup: true });
      navigate(`/chat?group=${encodeURIComponent(channelData.name)}`, {
        replace: false,
      });

      // Highlight the specific message
      setHighlightedMessageId(msg.id);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 3000);
    } else {
      // This is a direct message
      const name = msg.name.trim();
      const lowerName = name.toLowerCase();

      // try to find a matching user by name
      const matchedUser = users.find(
        (u) => u.name.trim().toLowerCase() === lowerName
      );

      // Update UI immediately + navigate
      if (matchedUser) {
        setActiveUser(matchedUser);
        navigate(`/chat?user=${encodeURIComponent(name)}`, { replace: false });

        // Highlight the specific message
        setHighlightedMessageId(msg.id);

        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, 3000);
      }
    }

    // close the activity panel
    setActivePanel("home");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // ---------- Handle keyboard navigation in mention list ----------
  const handleMentionKeyDown = (e) => {
    if (!showMentionList) return;

    const filteredMembers = [
      ...(mentionSearch === "" || "here".includes(mentionSearch.toLowerCase())
        ? [{ name: "here", id: "here", avatar: "" }]
        : []),
      ...groupMembers.filter((m) =>
        m.name.toLowerCase().includes(mentionSearch.toLowerCase())
      ),
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedMentionIndex((prev) =>
        prev < filteredMembers.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedMentionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredMembers.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredMembers[selectedMentionIndex]) {
        handleSelectMention(filteredMembers[selectedMentionIndex]);
      }
    } else if (e.key === "Escape") {
      setShowMentionList(false);
    }
  };

  // ---------- Handle keyboard navigation in threads page mention list ----------
  const handleThreadsPageMentionKeyDown = (e, messageId, chatId) => {
    const key = getThreadsPageReplyKey(messageId);
    const showMentionList = threadsPageShowMentionLists[key];

    if (!showMentionList) return;

    const searchValue = threadsPageMentionSearches[key] || "";
    const chatGroupMembers = getGroupMembersForChat(chatId);
    const filteredMembers = [
      ...(searchValue === "" || "here".includes(searchValue.toLowerCase())
        ? [{ name: "here", id: "here", avatar: "" }]
        : []),
      ...chatGroupMembers.filter((m) =>
        m.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    ];

    const currentIndex = threadsPageSelectedMentionIndexes[key] || 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setThreadsPageSelectedMentionIndexes((prev) => ({
        ...prev,
        [key]: currentIndex < filteredMembers.length - 1 ? currentIndex + 1 : 0,
      }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setThreadsPageSelectedMentionIndexes((prev) => ({
        ...prev,
        [key]: currentIndex > 0 ? currentIndex - 1 : filteredMembers.length - 1,
      }));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredMembers[currentIndex]) {
        handleThreadsPageSelectMention(
          filteredMembers[currentIndex],
          messageId
        );
      }
    } else if (e.key === "Escape") {
      setThreadsPageShowMentionLists((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  // ---------- Handle keyboard navigation in thread mention list ----------
  const handleThreadMentionKeyDown = (e) => {
    if (!threadShowMentionList) return;

    const filteredMembers = [
      ...(threadMentionSearch === "" ||
      "here".includes(threadMentionSearch.toLowerCase())
        ? [{ name: "here", id: "here", avatar: "" }]
        : []),
      ...groupMembers.filter((m) =>
        m.name.toLowerCase().includes(threadMentionSearch.toLowerCase())
      ),
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setThreadSelectedMentionIndex((prev) =>
        prev < filteredMembers.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setThreadSelectedMentionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredMembers.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredMembers[threadSelectedMentionIndex]) {
        handleThreadSelectMention(filteredMembers[threadSelectedMentionIndex]);
      }
    } else if (e.key === "Escape") {
      setThreadShowMentionList(false);
    }
  };

  // ---------- Insert mention into editor and close dropdown ----------
  const handleSelectMention = (member) => {
    const quillComponent = quillRef.current;
    const quill = quillComponent?.getEditor && quillComponent.getEditor();

    // Close the mention list first to prevent auto-open conflicts
    setShowMentionList(false);

    if (!quill) {
      // For simple text input, replace the @ with the mention
      setMessage((prev) => {
        const lastAtIndex = prev.lastIndexOf("@");
        if (lastAtIndex >= 0) {
          return prev.substring(0, lastAtIndex) + `@${member.name} `;
        }
        return (prev || "") + `@${member.name} `;
      });
    } else {
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();

      // Find the last @ and replace it with the mention
      const text = quill.getText();
      const lastAtIndex = text.lastIndexOf("@", index - 1);

      if (lastAtIndex >= 0) {
        // Replace from @ to current position with the mention
        quill.deleteText(lastAtIndex, index - lastAtIndex);
        quill.insertText(lastAtIndex, `@${member.name} `);
        quill.setSelection(lastAtIndex + member.name.length + 2);
      } else {
        // Fallback: insert at current position
        quill.insertText(index, `@${member.name} `);
        quill.setSelection(index + member.name.length + 2);
      }

      setTimeout(() => {
        try {
          setMessage(quill.root.innerHTML);
        } catch (e) {
          /* ignore */
        }
      }, 0);
    }

    // close dropdown & clear search
    setShowMentionList(false);
    setMentionSearch("");
  };

  // ---------- Close dropdown on outside click or ESC ----------
  useEffect(() => {
    if (!showMentionList) return;

    function onDocClick(e) {
      const insideDropdown = mentionListRef.current?.contains?.(e.target);
      const clickedButton = mentionButtonRef.current?.contains?.(e.target);
      if (!insideDropdown && !clickedButton) setShowMentionList(false);
    }

    function onKeyDown(e) {
      if (e.key === "Escape") setShowMentionList(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showMentionList]);

  // Main mention dropdown click outside handler
  useEffect(() => {
    if (!showMentionList) return;

    function onDocClick(e) {
      const insideDropdown = mentionListRef.current?.contains?.(e.target);
      const clickedButton = mentionButtonRef.current?.contains?.(e.target);
      if (!insideDropdown && !clickedButton) setShowMentionList(false);
    }

    function onKeyDown(e) {
      handleMentionKeyDown(e);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showMentionList, selectedMentionIndex, mentionSearch]);

  // Thread mention dropdown click outside handler
  useEffect(() => {
    if (!threadShowMentionList) return;

    function onDocClick(e) {
      const insideDropdown = threadMentionListRef.current?.contains?.(e.target);
      const clickedButton = threadMentionButtonRef.current?.contains?.(
        e.target
      );
      if (!insideDropdown && !clickedButton) setThreadShowMentionList(false);
    }

    function onKeyDown(e) {
      handleThreadMentionKeyDown(e);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [threadShowMentionList, threadSelectedMentionIndex, threadMentionSearch]);

  // Threads page mention dropdown keyboard handler
  useEffect(() => {
    // Check if any threads page mention list is open
    const anyMentionListOpen = Object.values(threadsPageShowMentionLists).some(
      (open) => open
    );

    if (!anyMentionListOpen) return;

    function onKeyDown(e) {
      // Find which mention list is open and handle the keydown
      Object.entries(threadsPageShowMentionLists).forEach(([key, isOpen]) => {
        if (isOpen) {
          // Extract messageId from key (key is just messageId)
          const messageId = key;
          // Find the chatId for this message
          const messagesWithReplies = getAllMessagesWithReplies();
          const message = messagesWithReplies.find(
            (m) => m.id.toString() === messageId
          );
          if (message) {
            handleThreadsPageMentionKeyDown(e, messageId, message.chatId);
          }
        }
      });
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    threadsPageShowMentionLists,
    threadsPageSelectedMentionIndexes,
    threadsPageMentionSearches,
  ]);

  // Thread reply menu click outside handler
  useEffect(() => {
    if (!showReplyMenu) return;

    function onDocClick(e) {
      if (!e.target.closest(".reply-menu-container")) {
        setShowReplyMenu(null);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") setShowReplyMenu(null);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showReplyMenu]);

  // 🔹 Audio/Video recording states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaRecorderVideo, setMediaRecorderVideo] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const recordingChunksRef = useRef([]);
  const videoChunksRef = useRef([]);
  const videoPreviewRef = useRef(null);
  const audioDeleteRef = useRef(false);
  const videoDeleteRef = useRef(false);

  // Handle video preview when recording starts
  useEffect(() => {
    if (isRecordingVideo && videoStream && videoPreviewRef.current) {
      try {
        videoPreviewRef.current.srcObject = videoStream;
        videoPreviewRef.current.muted = true;
        videoPreviewRef.current.play?.();
        console.log("Video preview attached via useEffect");
      } catch (e) {
        console.error("Error attaching video preview in useEffect:", e);
      }
    }
  }, [isRecordingVideo, videoStream]);

  // 🔹 Start Audio Recording
  const handleStartAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      // Clear previous chunks
      recordingChunksRef.current = [];
      setRecordingChunks([]);
      audioDeleteRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordingChunksRef.current.push(e.data);
          setRecordingChunks([...recordingChunksRef.current]);
          console.log(
            "Added chunk:",
            e.data.size,
            "bytes, total chunks:",
            recordingChunksRef.current.length
          );
        }
      };

      recorder.onstop = () => {
        if (!audioDeleteRef.current) {
          const blob = new Blob(recordingChunksRef.current, {
            type: "audio/webm",
          });
          console.log(
            "MediaRecorder onstop - created blob:",
            blob.size,
            "bytes from",
            recordingChunksRef.current.length,
            "chunks"
          );
          setAudioBlob(blob);
        } else {
          console.log("Audio delete flagged; skipping blob creation");
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordingStartTime(Date.now());
      setIsRecordingAudio(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Audio recording error:", err);
    }
  };

  // 🔹 Pause/Resume Audio Recording
  const handlePauseResumeAudio = () => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
      }
    }
  };

  // 🔹 Stop Audio Recording
  const handleStopAudio = () => {
    if (mediaRecorder) {
      console.log("Stopping recording...");
      // Calculate duration
      const duration = recordingStartTime
        ? (Date.now() - recordingStartTime) / 1000
        : 0;
      setRecordingDuration(duration);

      // Stop the recorder - the blob will be created in onstop callback
      mediaRecorder.stop();

      // Fallback: if onstop doesn't work, create blob after a short delay
      setTimeout(() => {
        if (recordingChunksRef.current.length > 0 && !audioBlob) {
          console.log("Fallback: Creating blob from chunks");
          const blob = new Blob(recordingChunksRef.current, {
            type: "audio/webm",
          });
          setAudioBlob(blob);
        }
      }, 100);
    }
    setIsRecordingAudio(false);
    setIsPaused(false);
  };

  // 🔹 Delete Audio Recording
  const handleDeleteAudio = () => {
    try {
      audioDeleteRef.current = true;
      // clear chunks immediately so UI clears and no blob is formed
      recordingChunksRef.current = [];
      setRecordingChunks([]);
      setAudioBlob(null);
      setIsRecordingAudio(false);
      setIsPaused(false);
      setRecordingDuration(0);
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    } catch {}
  };

  // 🔹 Start Video Recording
  const handleStartVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const recorder = new MediaRecorder(stream);

      // reset chunks
      videoChunksRef.current = [];
      videoDeleteRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (!videoDeleteRef.current) {
          const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
          setVideoBlob(blob);
        } else {
          console.log("Video delete flagged; skipping blob creation");
        }
        // stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        // clear preview
        if (videoPreviewRef.current) {
          try {
            videoPreviewRef.current.srcObject = null;
          } catch {}
        }
      };

      // start recording
      recorder.start();
      setMediaRecorderVideo(recorder);
      setVideoStream(stream);
      setIsVideoPaused(false);
      setIsRecordingVideo(true);

      // attach live preview after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (videoPreviewRef.current) {
          try {
            videoPreviewRef.current.srcObject = stream;
            videoPreviewRef.current.muted = true;
            videoPreviewRef.current.play?.();
            console.log("Video preview attached successfully");
          } catch (e) {
            console.error("Error attaching video preview:", e);
          }
        } else {
          console.warn("Video preview ref not available");
        }
      }, 100);
    } catch (err) {
      console.error("Video recording error:", err);
    }
  };

  // 🔹 Stop Video Recording
  const handleStopVideo = () => {
    if (mediaRecorderVideo) {
      mediaRecorderVideo.stop();
    }
    if (videoStream) {
      videoStream.getTracks().forEach((t) => t.stop());
    }
    setIsRecordingVideo(false);
    setIsVideoPaused(false);
  };

  // 🔹 Pause/Resume Video Recording
  const handlePauseResumeVideo = () => {
    if (!mediaRecorderVideo) return;
    try {
      if (isVideoPaused) {
        mediaRecorderVideo.resume();
        setIsVideoPaused(false);
      } else {
        mediaRecorderVideo.pause();
        setIsVideoPaused(true);
      }
    } catch (e) {
      console.error("Pause/Resume video error:", e);
    }
  };

  // 🔹 Delete Video Recording (before send)
  const handleDeleteVideo = () => {
    try {
      videoDeleteRef.current = true;
      // clear chunks immediately and UI state
      videoChunksRef.current = [];
      setVideoBlob(null);
      setIsRecordingVideo(false);
      setIsVideoPaused(false);
      if (videoPreviewRef.current) {
        try {
          videoPreviewRef.current.srcObject = null;
        } catch {}
      }
      if (mediaRecorderVideo && mediaRecorderVideo.state !== "inactive") {
        mediaRecorderVideo.stop();
      }
      if (videoStream) {
        try {
          videoStream.getTracks().forEach((t) => t.stop());
        } catch {}
      }
    } catch {}
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#141414]">
      {/* Mini Left Panel */}
      <div className="w-12 flex flex-col justify-between items-center bg-[#350D36] text-white py-4">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-3">
          {/* User Initials (Square) */}
          <div className="w-8 h-8 bg-gray-600 flex items-center justify-center rounded-md font-bold text-white">
            {username?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Home (Chats) */}
          <div className="flex flex-col items-center">
            <button
              className={`p-2 rounded-md ${
                activePanel === "home"
                  ? "bg-[#724875] text-white"
                  : "hover:bg-[#72487540] text-gray-300"
              }`}
              onClick={() => setActivePanel("home")}
            >
              <Icon
                icon="material-symbols-light:home-rounded"
                className="w-5 h-5"
              />
            </button>
            <span className="text-[10px] mt-1 text-white">Home</span>
          </div>

          {/* Activity (Missed Messages) */}
          <div
            className="flex flex-col items-center relative"
            ref={activityRef}
            onMouseEnter={() => {
              if (activityPanelTimeoutRef.current) {
                clearTimeout(activityPanelTimeoutRef.current);
                activityPanelTimeoutRef.current = null;
              }
              setActivePanel("activity");
            }}
            onMouseLeave={() => {
              activityPanelTimeoutRef.current = setTimeout(() => {
                setActivePanel("home");
              }, 200);
            }}
          >
            <button
              className={`p-2 rounded-md relative ${
                activePanel === "activity"
                  ? "bg-[#724875] text-white"
                  : "hover:bg-[#72487540] text-gray-300"
              }`}
            >
              <Icon icon="mdi:bell-outline" className="w-5 h-5" />
              {getUnreadNotificationCount() > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#EBBDF9", color: "#3F0E40" }}
                >
                  {getUnreadNotificationCount() > 9
                    ? "9+"
                    : getUnreadNotificationCount()}
                </span>
              )}
            </button>
            <span className="text-[10px] mt-1 text-white">Activity</span>

            {/* Activity Panel */}
            {activePanel === "activity" && (
              <div
                className="absolute left-14 top-0 w-80 h-96 bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden z-[9999] flex flex-col"
                onMouseEnter={() => {
                  if (activityPanelTimeoutRef.current) {
                    clearTimeout(activityPanelTimeoutRef.current);
                    activityPanelTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  activityPanelTimeoutRef.current = setTimeout(() => {
                    setActivePanel("home");
                  }, 200);
                }}
              >
                {/* Header */}
                <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
                  <h2 className="font-bold text-black text-[14px]">Activity</h2>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      // A notification is read if its ID is in readNotificationIds set
                      // Otherwise, it's unread (as created from unread messages)
                      const isRead = readNotificationIds.has(notification.id);

                      // Format date for display
                      const formatDate = (timeStr) => {
                        if (timeStr === "Yesterday") return "Yesterday";
                        if (timeStr.includes("AM") || timeStr.includes("PM")) {
                          // For today's messages, show just time
                          return timeStr;
                        }
                        // For older messages, you could parse and format differently
                        return timeStr;
                      };

                      return (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {/* Notification Category Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {notification.type === "message" && (
                                <>
                                  <Icon
                                    icon="mdi:message-text"
                                    className="w-3 h-3 text-gray-500"
                                  />
                                  <span
                                    className={`text-xs ${
                                      !isRead
                                        ? "font-bold text-black"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    New message
                                  </span>
                                </>
                              )}
                              {notification.type === "reply" && (
                                <>
                                  <Icon
                                    icon="mdi:reply"
                                    className="w-3 h-3 text-gray-500"
                                  />
                                  <span
                                    className={`text-xs ${
                                      !isRead
                                        ? "font-bold text-black"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    Thread in a{" "}
                                    {notification.isChannel
                                      ? "channel"
                                      : "direct message"}
                                  </span>
                                </>
                              )}
                              {notification.type === "mention" && (
                                <>
                                  <Icon
                                    icon="mdi:at"
                                    className="w-3 h-3 text-gray-500"
                                  />
                                  <span
                                    className={`text-xs ${
                                      !isRead
                                        ? "font-bold text-black"
                                        : "text-gray-500"
                                    } overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]`}
                                  >
                                    {notification.chatName} mention you in a
                                    chat
                                  </span>
                                </>
                              )}
                            </div>
                            {(notification.type === "message" ||
                              notification.type === "reply" ||
                              notification.type === "mention") && (
                              <div className="text-xs text-gray-400 flex-shrink-0">
                                {formatDate(notification.time)}
                              </div>
                            )}
                          </div>

                          {/* Main content */}
                          <div
                            className={`${
                              notification.type === "message"
                                ? "flex items-start"
                                : "flex justify-between items-start"
                            }`}
                          >
                            {/* Left side - Notification content */}
                            <div className="flex-1 min-w-0">
                              {notification.type === "message" && (
                                <div className="flex items-center gap-3">
                                  {/* User avatar or Channel icon */}
                                  {notification.isChannel ? (
                                    <div className="w-8 h-8 rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                                        #
                                      </span>
                                    </div>
                                  ) : notification.avatar ? (
                                    <img
                                      src={notification.avatar}
                                      alt={notification.chatName}
                                      className="w-8 h-8 rounded-md flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                                        {notification.chatName
                                          ?.charAt(0)
                                          ?.toUpperCase() || "?"}
                                      </span>
                                    </div>
                                  )}
                                  {/* User info and message - centered */}
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    {/* User name */}
                                    <div className="mb-1">
                                      <span
                                        className={`text-xs font-medium ${
                                          isRead
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                      >
                                        {notification.chatName}
                                      </span>
                                    </div>
                                    {/* Message content */}
                                    <p
                                      className={`text-xs ${
                                        isRead
                                          ? "text-gray-500"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {notification.message}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {notification.type === "reaction" && (
                                <>
                                  {/* Grey text at top */}
                                  <div className="text-xs text-gray-500 mb-2 truncate">
                                    {notification.chatName} reacted to your
                                    message
                                  </div>

                                  {/* 2-row layout with emoji */}
                                  <div className="flex gap-3">
                                    {/* Reaction emoji - 2 rows height */}
                                    <div className="flex flex-col justify-center">
                                      <span className="text-2xl">
                                        {notification.reactionEmoji}
                                      </span>
                                    </div>

                                    {/* Content - 2 rows */}
                                    <div className="flex-1 flex flex-col justify-center">
                                      {/* Row 1: Username */}
                                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {notification.messageAuthor ||
                                          notification.chatName}
                                      </div>
                                      {/* Row 2: Actual message */}
                                      <div className="text-xs text-gray-600 dark:text-gray-300">
                                        "{notification.message}"
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {notification.type === "reply" && (
                                <div className="space-y-2">
                                  {/* Row 1 & 2 & 3: Avatar (2 rows) + User name in row 1 + "replied to:" in row 2 + reply in row 3 */}
                                  <div className="flex gap-3">
                                    {/* User avatar - 2 rows height */}
                                    <div className="flex-shrink-0">
                                      {notification.avatar ? (
                                        <img
                                          src={notification.avatar}
                                          alt={notification.chatName}
                                          className="w-8 h-8 rounded-md"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                          <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                                            {notification.chatName
                                              ?.charAt(0)
                                              ?.toUpperCase() || "?"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Content: User name in row 1, "replied to:" in row 2, reply in row 3 */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                      {/* Row 1: User name */}
                                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {notification.chatName}
                                      </div>
                                      {/* Row 2: replied to: [original message] */}
                                      <div className="text-xs text-gray-500 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                        replied to:{" "}
                                        {notification.originalMessage ||
                                          "Untitled"}
                                      </div>
                                      {/* Row 3: [User name]: [actual reply] */}
                                      <div className="text-xs text-gray-700 dark:text-gray-300">
                                        {notification.chatName}:{" "}
                                        {notification.message}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {notification.type === "mention" && (
                                <div className="space-y-2">
                                  {/* User profile + name + message */}
                                  <div className="flex gap-3">
                                    {/* User avatar */}
                                    <div className="flex-shrink-0">
                                      {notification.avatar ? (
                                        <img
                                          src={notification.avatar}
                                          alt={notification.chatName}
                                          className="w-8 h-8 rounded-md"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                          <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                                            {notification.chatName
                                              ?.charAt(0)
                                              ?.toUpperCase() || "?"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Content: User name + message */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                      {/* User name */}
                                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {notification.chatName}
                                      </div>
                                      {/* Message content */}
                                      <div className="text-xs text-gray-700 dark:text-gray-300">
                                        {notification.message}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {notification.type === "reaction" && (
                                <div className="space-y-2">
                                  {/* Reaction content - only show reaction, no message */}
                                </div>
                              )}
                            </div>

                            {/* Right side - Time (only for reaction notifications) */}
                            {notification.type === "reaction" && (
                              <div className="text-xs text-gray-400 ml-2">
                                {formatDate(notification.time)}
                              </div>
                            )}
                          </div>

                          {/* Unread indicator */}
                          {!isRead && (
                            <div
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#EBBDF9" }}
                            ></div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] px-4">
                      {/* Bell icon */}
                      <Icon
                        icon="mdi:bell-outline"
                        className="w-10 h-10 text-gray-400 mb-3"
                      />
                      {/* Text */}
                      <p className="text-lg font-medium text-gray-700 text-center">
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Files */}
          <div
            className="flex flex-col items-center relative"
            ref={fileRef}
            onMouseEnter={() => {
              if (filePanelTimeoutRef.current) {
                clearTimeout(filePanelTimeoutRef.current);
                filePanelTimeoutRef.current = null;
              }
              setShowFilePanel(true);
            }}
            onMouseLeave={() => {
              filePanelTimeoutRef.current = setTimeout(() => {
                setShowFilePanel(false);
              }, 200);
            }}
          >
            <button
              className={`p-2 rounded-md ${
                showFilePanel
                  ? "bg-[#724875] text-white"
                  : "hover:bg-[#72487540] text-gray-300"
              }`}
            >
              <Icon icon="system-uicons:files-stack" className="w-5 h-5" />
            </button>
            <span className="text-[10px] mt-1 text-white">Files</span>

            {/* File Panel */}
            {showFilePanel && (
              <div
                className="absolute left-14 top-0 w-80 h-96 bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden z-[9999] flex flex-col"
                onMouseEnter={() => {
                  if (filePanelTimeoutRef.current) {
                    clearTimeout(filePanelTimeoutRef.current);
                    filePanelTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  filePanelTimeoutRef.current = setTimeout(() => {
                    setShowFilePanel(false);
                  }, 200);
                }}
              >
                {/* Header */}
                <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
                  <h2 className="font-bold text-black text-[14px]">Files</h2>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
                  {(() => {
                    const filesByPeriod = getFilesByTimePeriod();
                    const totalFiles = Object.values(filesByPeriod).reduce(
                      (sum, files) => sum + files.length,
                      0
                    );

                    if (totalFiles === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                          <Icon
                            icon="system-uicons:files-stack"
                            className="w-12 h-12 text-gray-400 mb-3"
                          />
                          <p className="text-lg font-medium text-gray-700 text-center">
                            No files shared yet
                          </p>
                        </div>
                      );
                    }

                    const timePeriods = [
                      { key: "today", label: "Today" },
                      { key: "yesterday", label: "Yesterday" },
                      { key: "1week", label: "1 Week" },
                      { key: "1month", label: "1 Month" },
                      { key: "previous", label: "Previous" },
                    ];

                    return timePeriods
                      .map((period) => {
                        const files = filesByPeriod[period.key];
                        if (files.length === 0) return null;

                        return (
                          <div key={period.key}>
                            {/* Time Period Header */}
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                                {period.label}
                              </h3>
                            </div>

                            {/* Files in this period */}
                            {files.map((file) => (
                              <div
                                key={file.fileId}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                onClick={() => handleFileClick(file)}
                              >
                                {/* File Icon */}
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                                  <Icon
                                    icon={getFileIcon(file)}
                                    width="20"
                                    className="text-gray-600"
                                  />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm text-black font-semibold truncate">
                                      {file.name}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {file.chatName}
                                  </p>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-500">
                                      {file.size
                                        ? Math.round(file.size / 1024) + " KB"
                                        : "Unknown size"}
                                    </p>
                                    {file.messageTime && (
                                      <p className="text-xs text-gray-400">
                                        {file.messageTime}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                      .filter(Boolean);
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* bottom section */}
        <div className="flex flex-col items-center gap-4 relative">
          {/* Plus Icon for Create Panel */}
          <div
            className="flex flex-col items-center relative"
            ref={createPanelRef}
          >
            <button
              onClick={() => setShowCreatePanel(!showCreatePanel)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                showCreatePanel
                  ? "bg-white text-black"
                  : "bg-[#724875] hover:bg-[#5a3a5c] text-white"
              }`}
              title={showCreatePanel ? "Close" : "Create"}
            >
              <Icon
                icon={
                  showCreatePanel
                    ? "material-symbols:close"
                    : "material-symbols:add"
                }
                className={showCreatePanel ? "w-4 h-4" : "w-5 h-5"}
              />
            </button>

            {/* Create Panel */}
            {showCreatePanel && (
              <div className="absolute left-14 bottom-0 w-80 max-h-96 bg-white dark:bg-[#0D0D0D] shadow-lg rounded-lg border border-gray-300 dark:border-gray-700 overflow-y-auto z-[9999] scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
                {/* Header */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-bold text-black dark:text-white text-[14px]">
                    Create
                  </h2>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Message Option */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setShowCreatePanel(false);
                      setActiveUser(null);
                      setNewChatModalOpen(true);
                    }}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <Icon
                        icon="pajamas:duo-chat-new"
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-black dark:text-white font-semibold">
                        Start New Chat
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Send a message to someone
                      </p>
                    </div>
                  </div>

                  {/* Group Option */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setShowCreatePanel(false);
                      setGroupModalOpen(true);
                    }}
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                      <Icon
                        icon="heroicons:user-group-16-solid"
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-black dark:text-white font-semibold">
                        Create Channel
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Start a group conversation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative group">
            <img
              src="/avatar1.png"
              alt="Profile"
              className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer"
              onClick={() => setStatusModalOpen(true)}
            />

            {/* Status indicator */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#350D36] flex items-center justify-center text-[8px]`}
              style={{ backgroundColor: userStatus.color || "#22c55e" }}
            >
              {userStatus.emoji ? (
                <span className="text-[8px] leading-none">
                  {userStatus.emoji}
                </span>
              ) : null}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999]">
              {userStatus.emoji} {userStatus.text}
            </div>
          </div>

          {/* Status Modal - Two-Step Flow */}
          {statusModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#0B0B0B] text-black dark:text-white rounded-xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between pt-4 px-4">
                  <h3 className="font-semibold text-lg text-[#350D36] dark:text-white">
                    {statusModalStep === 1
                      ? "Set a status"
                      : "Set status duration"}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-[#350D36] dark:hover:text-white transition-colors"
                    onClick={() => {
                      setStatusModalOpen(false);
                      setStatusModalStep(1);
                    }}
                  >
                    <Icon icon="material-symbols:close" className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-white dark:bg-[#0B0B0B]">
                  {statusModalStep === 1 ? (
                    // Step 1: Select Status
                    <>
                      {/* Custom Status - At Top */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3 text-sm text-[#350D36] dark:text-gray-300">
                          Custom status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setShowStatusEmojiPicker(!showStatusEmojiPicker)
                              }
                              className="w-8 h-8 rounded-lg border border-[#3F0E40] dark:border-gray-600 flex items-center justify-center text-lg hover:bg-[#F9EDFF] dark:hover:bg-gray-800 transition-colors"
                            >
                              {customStatusEmoji}
                            </button>
                            <input
                              type="text"
                              placeholder="What's your status?"
                              value={customStatusText}
                              onChange={(e) =>
                                setCustomStatusText(e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-[#3F0E40] dark:border-gray-600 rounded-lg bg-white dark:bg-[#0B0B0B] focus:outline-none focus:ring-2 focus:ring-[#724875] text-[#350D36] dark:text-white"
                            />
                          </div>

                          {showStatusEmojiPicker && (
                            <div className="p-3 border border-[#3F0E40] dark:border-gray-700 rounded-lg bg-[#F9EDFF] dark:bg-gray-800">
                              <div className="grid grid-cols-8 gap-2">
                                {[
                                  "😊",
                                  "😴",
                                  "🍕",
                                  "☕",
                                  "💻",
                                  "📚",
                                  "🎮",
                                  "🏠",
                                  "🚗",
                                  "✈️",
                                  "🏖️",
                                  "🤒",
                                  "📅",
                                  "🔴",
                                  "🟡",
                                  "🟢",
                                ].map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      setCustomStatusEmoji(emoji);
                                      setShowStatusEmojiPicker(false);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#724875] hover:bg-opacity-20 dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {customStatusText && (
                            <button
                              onClick={() =>
                                handleStatusSelection({ type: "custom" })
                              }
                              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors bg-[#F9EDFF] dark:bg-[#1B1B1B] border border-[#724875] dark:border-gray-700 hover:bg-[#724875] hover:bg-opacity-10 dark:hover:bg-gray-800"
                            >
                              <span className="text-lg">
                                {customStatusEmoji}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-[#350D36] dark:text-white">
                                  {customStatusText}
                                </div>
                              </div>
                              <Icon
                                icon="material-symbols:arrow-forward"
                                className="w-5 h-5 text-[#724875]"
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Presets */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3 text-sm text-[#350D36] dark:text-gray-300">
                          Status presets
                        </h4>
                        <div className="space-y-1">
                          {defaultStatuses.map((status) => (
                            <button
                              key={status.type}
                              onClick={() => handleStatusSelection(status)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-[#F9EDFF] dark:hover:bg-gray-800"
                            >
                              <span className="text-lg">{status.emoji}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-[#350D36] dark:text-white">
                                  {status.text}
                                </div>
                              </div>
                              <Icon
                                icon="material-symbols:arrow-forward"
                                className="w-5 h-5 text-[#724875]"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Step 2: Set Duration
                    <>
                      {/* Selected Status Display */}
                      <div className="mb-6 p-4 bg-[#F9EDFF] dark:bg-[#1B1B1B] rounded-lg border border-[#724875] dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {tempSelectedStatus?.emoji}
                          </span>
                          <div>
                            <div className="font-medium text-lg text-[#350D36] dark:text-white">
                              {tempSelectedStatus?.text}
                            </div>
                            <div className="text-sm text-[#724875] dark:text-gray-400">
                              {tempSelectedStatus?.type === "custom"
                                ? "Custom status"
                                : "Status preset"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Duration Selection */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3 text-sm text-[#350D36] dark:text-gray-300">
                          Clear status after
                        </h4>
                        <select
                          value={statusDuration}
                          onChange={(e) => setStatusDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-[#3F0E40] dark:border-gray-600 rounded-lg bg-white dark:bg-[#0B0B0B] focus:outline-none focus:ring-2 focus:ring-[#724875] text-[#350D36] dark:text-white"
                          style={{
                            accentColor: "#724875",
                          }}
                        >
                          {statusDurations.map((duration) => (
                            <option
                              key={duration.value}
                              value={duration.value}
                              className="bg-white dark:bg-[#0B0B0B] text-[#350D36] dark:text-white hover:bg-[#F9EDFF] dark:hover:bg-[#1B1B1B]"
                            >
                              {duration.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Date and Time Pickers */}
                      {statusDuration === "custom" && (
                        <div className="mb-6">
                          <h4 className="font-medium mb-3 text-sm text-[#350D36] dark:text-gray-300">
                            Choose date and time
                          </h4>

                          {/* Date and Time Inputs in Same Row */}
                          <div className="flex gap-3">
                            {/* Date Picker */}
                            <div className="flex-1">
                              <div className="relative">
                                {/* <Icon
                                  icon="material-symbols:calendar-month"
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                /> */}
                                <input
                                  type="date"
                                  value={customDate}
                                  onChange={(e) => {
                                    setCustomDate(e.target.value);
                                    setIsTimeValid(
                                      validateCustomTime(
                                        e.target.value,
                                        customTime
                                      )
                                    );
                                  }}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full pl-2 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0B0B0B] text-[#350D36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#724875] focus:border-transparent"
                                  placeholder="Today"
                                />
                              </div>
                            </div>

                            {/* Time Picker */}
                            <div className="flex-1">
                              <div className="relative">
                                {/* <Icon
                                  icon="material-symbols:access-time"
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                /> */}
                                <input
                                  type="time"
                                  value={customTime}
                                  onChange={(e) => {
                                    setCustomTime(e.target.value);
                                    const isValid = validateCustomTime(
                                      customDate,
                                      e.target.value
                                    );
                                    setIsTimeValid(isValid);
                                  }}
                                  className={`w-full pl-2 pr-3 py-2 border rounded-lg bg-white dark:bg-[#0B0B0B] text-[#350D36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#724875] focus:border-transparent ${
                                    customDate && customTime && !isTimeValid
                                      ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                  placeholder="1:30 PM"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 ">
                  {statusModalStep === 1 ? (
                    // Step 1 Footer
                    <>
                      <button
                        onClick={clearStatus}
                        className="text-sm text-[#724875] dark:text-gray-400 hover:text-[#350D36] dark:hover:text-gray-200 transition-colors"
                      >
                        Clear status
                      </button>
                      <button
                        onClick={() => {
                          setStatusModalOpen(false);
                          setStatusModalStep(1);
                        }}
                        className="px-4 py-2 text-sm font-medium border border-[#350D36] text-[#350D36] dark:text-gray-300 hover:bg-[#724875] hover:bg-opacity-10 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    // Step 2 Footer
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={goBackToStatusSelection}
                        className="px-4 py-2 text-sm font-medium border border-[#350D36] text-[#350D36] dark:text-gray-300 hover:bg-[#724875] hover:bg-opacity-10 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveStatus}
                        disabled={
                          statusDuration === "custom" &&
                          (!customDate || !customTime || !isTimeValid)
                        }
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          statusDuration === "custom" &&
                          (!customDate || !customTime || !isTimeValid)
                            ? "text-gray-400 bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                            : "text-white bg-[#724875] hover:bg-[#5a3a5c]"
                        }`}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-72 bg-[#3F0E40] text-white flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 z-50
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} p-4`}
      >
        {/* Collapse button */}
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={() => setSidebarOpen(false)}>
            <Icon icon="mdi:close" width="24" />
          </button>
        </div>

        {/* Search + Create Group + New Chat */}
        <div className="flex items-center gap-2 pb-2 pr-2 pl-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-white"
              width="18"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 rounded-lg
       bg-[#724875] dark:bg-[#724875] text-sm shadow-sm 
       focus:outline-none focus:ring-0 placeholder-white
       transition"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#350D36] mt-2 mb-2"></div>

        {/* Sidebar list (Threads / Channels / Favorites / Direct Messages) */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
          {/* Threads Section */}
          <div
            className={`group flex items-center justify-between px-4 py-2 text-[14px] cursor-pointer hover:bg-[#81D9591A] hover:text-white rounded-md ${
              showThreadsPage ? "bg-[#F9EDFF] dark:bg-[#F9EDFF]" : ""
            }`}
            onClick={handleThreadsClick}
          >
            <div className="flex items-center gap-2">
              <Icon
                icon="icon-park-outline:message"
                className={`w-4 h-4 ${
                  showThreadsPage
                    ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                    : "text-white dark:text-white"
                }`}
              />
              <span
                className={`truncate ${
                  showThreadsPage
                    ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                    : "text-white dark:text-white"
                }`}
              >
                Threads
              </span>
            </div>
            {getUnreadRepliesCount() > 0 && (
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "#EBBDF9", color: "#3F0E40" }}
              >
                {getUnreadRepliesCount()}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t border-[#EBBDF940] my-2"></div>

          {/* Channels Section */}
          {channels.length > 0 && (
            <>
              <div
                className="px-4 py-1 text-xs text-white tracking-wide flex items-center cursor-pointer gap-2"
                onClick={() => setShowChannels((prev) => !prev)}
              >
                <Icon
                  icon={
                    showChannels
                      ? "lsicon:triangle-down-filled"
                      : "lsicon:triangle-right-filled"
                  }
                  className="w-3 h-3"
                />
                <span>Channels</span>
              </div>
              {showChannels &&
                channels.map((group) => (
                  <div
                    key={group.id}
                    className={`group flex items-center gap-2 px-4 py-1 mb-1 text-[14px] cursor-pointer hover:bg-[#81D9591A] hover:text-white rounded-md ${
                      activeUser?.id === group.id && !showThreadsPage
                        ? "bg-[#F9EDFF] dark:bg-[#F9EDFF]"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveUser({ ...group, isGroup: true });
                      setShowThreadsPage(false);
                      navigate(
                        `/chat?group=${encodeURIComponent(group.name)}`,
                        { replace: false }
                      );
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <span
                      className={`font-medium text-lg ${
                        activeUser?.id === group.id && !showThreadsPage
                          ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                          : "text-white dark:text-white"
                      }`}
                    >
                      #
                    </span>
                    <span
                      className={`truncate ${
                        activeUser?.id === group.id && !showThreadsPage
                          ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                          : "text-white dark:text-white"
                      }`}
                    >
                      {group.name}
                    </span>
                  </div>
                ))}
            </>
          )}

          {/* Favorite Users */}
          {favoriteUsers.length > 0 && (
            <>
              <div className="border-t border-[#EBBDF940] my-2"></div>
              <div
                className="px-4 py-1 text-xs text-white tracking-wide mt-2 flex items-center cursor-pointer gap-2"
                onClick={() => setShowFavorites((prev) => !prev)}
              >
                <Icon
                  icon={
                    showFavorites
                      ? "lsicon:triangle-down-filled"
                      : "lsicon:triangle-right-filled"
                  }
                  className="w-3 h-3"
                />
                <span>Favorites</span>
              </div>
              {showFavorites &&
                favoriteUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`group flex items-center gap-2 px-4 py-2 mb-1 text-[14px] cursor-pointer hover:bg-[#81D9591A] hover:text-white rounded-md ${
                      activeUser?.id === user.id && !showThreadsPage
                        ? "bg-[#F9EDFF] dark:bg-[#F9EDFF]"
                        : ""
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-[20px] h-[20px] rounded-md"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full border-[3px] border-[#350D36] ${
                          user.online ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`truncate ${
                        activeUser?.id === user.id && !showThreadsPage
                          ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                          : "text-white dark:text-white"
                      }`}
                    >
                      {user.name}
                    </span>
                  </div>
                ))}
            </>
          )}
          <div className="border-t border-[#EBBDF940] my-2"></div>

          {/* Regular Users / Direct Messages */}
          {regularUsers.length > 0 && (
            <>
              <div
                className="px-4 py-1 mb-1 text-xs text-white tracking-wide mt-2 flex items-center cursor-pointer gap-2"
                onClick={() => setShowDirectMessages((prev) => !prev)}
              >
                <Icon
                  icon={
                    showDirectMessages
                      ? "lsicon:triangle-down-filled"
                      : "lsicon:triangle-right-filled"
                  }
                  className="w-3 h-3"
                />
                <span>Direct Messages</span>
              </div>
              {showDirectMessages &&
                regularUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`group flex items-center gap-2 px-4 py-2 mb-1 text-[14px] cursor-pointer hover:bg-[#81D9591A] hover:text-white rounded-md ${
                      activeUser?.id === user.id && !showThreadsPage
                        ? "bg-[#F9EDFF] dark:bg-[#F9EDFF]"
                        : ""
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-[20px] h-[20px] rounded-md"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full border-[3px] border-[#350D36] ${
                          user.online ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`truncate ${
                        activeUser?.id === user.id && !showThreadsPage
                          ? "text-[#3F0E40] dark:text-[#3F0E40] group-hover:text-white"
                          : "text-white dark:text-white"
                      }`}
                    >
                      {user.name}
                    </span>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#0D0D0D]">
        {/* Top Navigation */}
        <div className="flex flex-row justify-start items-center gap-2 p-3 bg-[#3F0E40] shadow-sm">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden text-[#3F0E40] hover:bg-[#3F0E40]/10 p-2 rounded-lg transition"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Icon icon="mdi:menu" width="24" />
          </button>

          <h1 className="flex items-center text-md font-semibold text-white">
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="flex items-center text-white hover:underline"
            >
              Dashboard
            </button>
            <Icon
              icon="mdi:chevron-right"
              className="mx-1 text-white"
              width="16"
              height="16"
            />
            Chat
          </h1>
        </div>

        {/* Fixed Header */}
        {activeUser && !showThreadsPage && (
          <div className="px-6 py-2 bg-white dark:bg-[#0D0D0D] m-1 rounded-t-lg">
            {/* Compact Chat Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-3">
                {activeUser.isGroup ? (
                  <div>
                    <h2 className="text-[16px] dark:text-white font-semibold">
                      # {activeUser.name}
                    </h2>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="w-6 h-6 rounded-lg shadow"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1A1D21] ${
                          activeUser.online ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex items-center">
                      <h2 className="text-[15px] dark:text-white font-semibold">
                        {activeUser.name}
                      </h2>
                    </div>
                  </>
                )}
              </div>

              {/* Right: Buttons */}
              <div className="flex flex-wrap gap-2 justify-end mt-2 sm:mt-0">
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
                      width="18"
                    />
                  </button>
                )}

                {activeUser.isGroup ? (
                  <>
                    <button
                      onClick={() => setShowGroupMembers(true)}
                      className="h-7 flex items-center justify-center px-2 border border-[#3F0E40] text-[#3F0E40] rounded-full text-xs hover:bg-[#3F0E40] hover:text-white shadow-sm transition"
                    >
                      View Members
                    </button>

                    <button
                      onClick={() => setShowAddMember(true)}
                      className="h-7 flex items-center justify-center px-2 border border-[#3F0E40] text-[#3F0E40] rounded-full text-xs hover:bg-[#3F0E40] hover:text-white shadow-sm transition"
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
                    className="h-7 flex items-center justify-center px-2 border border-[#3F0E40] text-[#3F0E40] rounded-full text-xs hover:bg-[#3F0E40] hover:text-white shadow-sm transition"
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Tabs (Messages | Files | Pins) */}
            <div className="flex gap-6 mt-3">
              <button
                className={`flex items-center gap-1 text-sm pb-1 ${
                  activeTab === "messages"
                    ? "text-[#3F0E40] dark:text-white font-semibold border-b-2 border-[#3F0E40]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("messages")}
              >
                <Icon icon="mdi:message-text-outline" width="18" />
                Messages
              </button>
              <button
                className={`flex items-center gap-1 text-sm pb-1 ${
                  activeTab === "files"
                    ? "text-[#3F0E40] dark:text-white font-semibold border-b-2 border-[#3F0E40]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("files")}
              >
                <Icon icon="mdi:file-outline" width="18" />
                Files
              </button>
              <button
                className={`flex items-center gap-1 text-sm pb-1 ${
                  activeTab === "pins"
                    ? "text-[#3F0E40] dark:text-white font-semibold border-b-2 border-[#3F0E40]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("pins")}
              >
                <Icon icon="mdi:pin-outline" width="18" />
                Pins
              </button>
            </div>
          </div>
        )}

        {/* Separator */}
        {activeUser && !showThreadsPage && (
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="px-6 py-2 overflow-y-auto flex-1 space-y-4 bg-white dark:bg-[#0D0D0D] m-1 rounded-b-lg pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent"
        >
          {showThreadsPage ? (
            <>
              {/* Threads Page Header */}
              <div className="px-0 py-0 bg-white dark:bg-[#0D0D0D] m-1 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <h2 className="text-[15px] font-semibold text-[#3F0E40] dark:text-white">
                    Threads
                  </h2>
                </div>
              </div>

              {/* Threads Content */}
              <div className="space-y-4">
                {(() => {
                  const messagesWithReplies = getAllMessagesWithReplies();

                  if (messagesWithReplies.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Icon
                          icon="icon-park-outline:message"
                          className="w-16 h-16 text-gray-400 mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                          No threads yet
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Start a conversation and reply to messages to see
                          threads here.
                        </p>
                      </div>
                    );
                  }

                  return messagesWithReplies.map((message, index) => (
                    <div
                      key={`${message.chatId}-${message.id}-${index}`}
                      className="bg-white dark:bg-[#0D0D0D] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      {/* Chat Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          icon={
                            message.chatType === "channel"
                              ? "mdi:hash"
                              : "mdi:account"
                          }
                          className="w-4 h-4 text-[#3F0E40]"
                        />
                        <span className="text-sm font-medium text-[#3F0E40] dark:text-white">
                          {message.chatName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>

                      {/* Original Message */}
                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <img
                            src={
                              message.chatType === "channel"
                                ? "/avatar1.png"
                                : users.find((u) => u.id === message.chatId)
                                    ?.avatar || "/avatar1.png"
                            }
                            alt={message.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {message.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.time}
                              </span>
                            </div>
                            <div
                              className="text-sm text-gray-700 dark:text-gray-300"
                              dangerouslySetInnerHTML={{ __html: message.text }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            icon="mdi:reply"
                            className="w-4 h-4 text-gray-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {message.replies.length}{" "}
                            {message.replies.length === 1 ? "reply" : "replies"}
                          </span>
                        </div>

                        {message.replies.map((reply, index) => (
                          <div
                            key={`${message.id}-reply-${index}-${reply.time}`}
                            className={`flex items-start gap-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600 ${
                              reply.status === "unread"
                                ? "bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 -ml-2 -mr-2"
                                : ""
                            }`}
                            onClick={() => {
                              if (reply.status === "unread") {
                                markReplyAsRead(
                                  message.chatId,
                                  message.id,
                                  reply.id
                                );
                              }
                            }}
                            style={{
                              cursor:
                                reply.status === "unread"
                                  ? "pointer"
                                  : "default",
                            }}
                          >
                            <img
                              src={
                                users.find((u) => u.name === reply.name)
                                  ?.avatar || "/avatar1.png"
                              }
                              alt={reply.name}
                              className="w-5 h-5 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                  {reply.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {reply.time}
                                </span>
                              </div>
                              <div
                                className="text-xs text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: reply.text }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Thread Reply Input with all features */}
                      <div className="relative mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        {threadsPageShowEmojiPickers[
                          getThreadsPageReplyKey(message.id)
                        ] && (
                          <div className="absolute bottom-[60px] left-4 z-50">
                            <Picker
                              onEmojiClick={(emojiData) =>
                                handleThreadsPageEmojiSelect(
                                  message.id,
                                  emojiData
                                )
                              }
                              theme="light"
                            />
                          </div>
                        )}

                        <div className="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000000] rounded-lg flex flex-col gap-1 shadow-sm">
                          {/* Rich Text Editor for Thread */}
                          <ReactQuill
                            ref={(el) => {
                              threadsPageQuillRefs.current[
                                getThreadsPageReplyKey(message.id)
                              ] = el;
                            }}
                            theme="snow"
                            value={getThreadsPageReplyText(message.id)}
                            onChange={(text) => {
                              setThreadsPageReplyText(message.id, text);
                              // Auto-open mention list when @ is typed in threads page
                              // Check if this message belongs to a group/channel (not direct message)
                              if (
                                message.chatType === "channel" &&
                                text.includes("@") &&
                                !threadsPageShowMentionLists[
                                  getThreadsPageReplyKey(message.id)
                                ]
                              ) {
                                const atIndex = text.lastIndexOf("@");
                                const afterAt = text.substring(atIndex + 1);
                                if (
                                  atIndex >= 0 &&
                                  (!afterAt ||
                                    afterAt === " " ||
                                    !afterAt.match(/^\w/))
                                ) {
                                  setTimeout(() => {
                                    const key = getThreadsPageReplyKey(
                                      message.id
                                    );
                                    if (!threadsPageShowMentionLists[key]) {
                                      setThreadsPageShowMentionLists(
                                        (prev) => ({ ...prev, [key]: true })
                                      );
                                      setThreadsPageMentionSearches((prev) => ({
                                        ...prev,
                                        [key]: "",
                                      }));
                                      setThreadsPageSelectedMentionIndexes(
                                        (prev) => ({ ...prev, [key]: 0 })
                                      );
                                    }
                                  }, 100);
                                }
                              }
                            }}
                            modules={modules}
                            placeholder="Reply to this message..."
                            className="chat-editor rounded-lg dark:bg-[#000000] dark:text-white shadow-sm"
                          />

                          {/* Thread Attachment preview */}
                          {threadsPageAttachedFiles[
                            getThreadsPageReplyKey(message.id)
                          ] && (
                            <div className="flex items-center gap-3 border rounded p-2 bg-gray-50 dark:bg-[#111] mb-1">
                              {threadsPageAttachedPreviewUrls[
                                getThreadsPageReplyKey(message.id)
                              ] &&
                              threadsPageAttachedFiles[
                                getThreadsPageReplyKey(message.id)
                              ].type.startsWith("image/") ? (
                                <img
                                  src={
                                    threadsPageAttachedPreviewUrls[
                                      getThreadsPageReplyKey(message.id)
                                    ]
                                  }
                                  alt="preview"
                                  className="w-20 h-20 object-cover rounded"
                                />
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <Icon
                                    icon={getFileIcon(
                                      threadsPageAttachedFiles[
                                        getThreadsPageReplyKey(message.id)
                                      ]
                                    )}
                                    width="20"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {
                                        threadsPageAttachedFiles[
                                          getThreadsPageReplyKey(message.id)
                                        ].name
                                      }
                                    </span>
                                    <span className="text-xs opacity-70">
                                      {Math.round(
                                        threadsPageAttachedFiles[
                                          getThreadsPageReplyKey(message.id)
                                        ].size / 1024
                                      )}{" "}
                                      KB
                                    </span>
                                  </div>
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  const key = getThreadsPageReplyKey(
                                    message.id
                                  );
                                  setThreadsPageAttachedFiles((prev) => {
                                    const updated = { ...prev };
                                    delete updated[key];
                                    return updated;
                                  });
                                  setThreadsPageAttachedPreviewUrls((prev) => {
                                    const updated = { ...prev };
                                    delete updated[key];
                                    return updated;
                                  });
                                }}
                                className="ml-auto text-red-500 hover:text-red-700 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          )}

                          {/* Thread Voice Message Preview */}
                          {threadsPageAudioBlobs[
                            getThreadsPageReplyKey(message.id)
                          ] &&
                            !threadsPageIsRecordingAudio[
                              getThreadsPageReplyKey(message.id)
                            ] && (
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                                <div className="flex items-center gap-3">
                                  <VoicePreviewComponent
                                    audioBlob={
                                      threadsPageAudioBlobs[
                                        getThreadsPageReplyKey(message.id)
                                      ]
                                    }
                                    duration={
                                      threadsPageRecordingDuration[
                                        getThreadsPageReplyKey(message.id)
                                      ] || 0
                                    }
                                    onDelete={() => {
                                      const key = getThreadsPageReplyKey(
                                        message.id
                                      );
                                      setThreadsPageAudioBlobs((prev) => {
                                        const updated = { ...prev };
                                        delete updated[key];
                                        return updated;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                          {/* Thread Video Message Preview */}
                          {threadsPageVideoBlobs[
                            getThreadsPageReplyKey(message.id)
                          ] &&
                            !threadsPageIsRecordingVideo[
                              getThreadsPageReplyKey(message.id)
                            ] && (
                              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                                <div className="flex items-center gap-3">
                                  <video
                                    controls
                                    src={URL.createObjectURL(
                                      threadsPageVideoBlobs[
                                        getThreadsPageReplyKey(message.id)
                                      ]
                                    )}
                                    className="flex-1 max-h-64 rounded"
                                  />
                                  <button
                                    onClick={() => {
                                      const key = getThreadsPageReplyKey(
                                        message.id
                                      );
                                      setThreadsPageVideoBlobs((prev) => {
                                        const updated = { ...prev };
                                        delete updated[key];
                                        return updated;
                                      });
                                    }}
                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                    title="Delete video"
                                  >
                                    <Icon icon="mdi:delete" width="16" />
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* Thread Action row: emoji, mention, attach, send */}
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() =>
                                toggleThreadsPageEmojiPicker(message.id)
                              }
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                            >
                              <Icon icon="fluent:emoji-16-regular" width="20" />
                            </button>

                            {message.chatType === "channel" && (
                              <>
                                <button
                                  ref={(el) => {
                                    threadsPageMentionButtonRefs.current[
                                      getThreadsPageReplyKey(message.id)
                                    ] = el;
                                  }}
                                  onClick={() => {
                                    const key = getThreadsPageReplyKey(
                                      message.id
                                    );
                                    setThreadsPageShowMentionLists((prev) => ({
                                      ...prev,
                                      [key]: !prev[key],
                                    }));
                                  }}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                                  aria-haspopup="listbox"
                                  aria-expanded={
                                    threadsPageShowMentionLists[
                                      getThreadsPageReplyKey(message.id)
                                    ]
                                  }
                                  title="Mention someone"
                                >
                                  <Icon
                                    icon="fluent:mention-16-regular"
                                    width="20"
                                  />
                                </button>

                                {/* Thread Mention dropdown */}
                                {threadsPageShowMentionLists[
                                  getThreadsPageReplyKey(message.id)
                                ] && (
                                  <div
                                    ref={(el) => {
                                      threadsPageMentionListRefs.current[
                                        getThreadsPageReplyKey(message.id)
                                      ] = el;
                                    }}
                                    className="absolute bottom-[60px] left-12 z-50 w-64 bg-white dark:bg-[#0B0B0B] border rounded shadow p-2"
                                  >
                                    {/* Search input */}
                                    <input
                                      value={
                                        threadsPageMentionSearches[
                                          getThreadsPageReplyKey(message.id)
                                        ] || ""
                                      }
                                      onChange={(e) => {
                                        const key = getThreadsPageReplyKey(
                                          message.id
                                        );
                                        setThreadsPageMentionSearches(
                                          (prev) => ({
                                            ...prev,
                                            [key]: e.target.value,
                                          })
                                        );
                                        setThreadsPageSelectedMentionIndexes(
                                          (prev) => ({
                                            ...prev,
                                            [key]: 0,
                                          })
                                        );
                                      }}
                                      placeholder="Search members..."
                                      className="w-full px-2 py-1 rounded border border-[#3F0E40] mb-2 text-sm bg-white dark:bg-[#111] dark:text-white focus:outline-none focus:ring-0"
                                      autoFocus
                                    />

                                    {/* Members list */}
                                    <ul className="max-h-48 overflow-auto">
                                      {(() => {
                                        const key = getThreadsPageReplyKey(
                                          message.id
                                        );
                                        const searchValue =
                                          threadsPageMentionSearches[key] || "";
                                        const chatGroupMembers =
                                          getGroupMembersForChat(
                                            message.chatId
                                          );
                                        const filteredMembers = [
                                          ...(searchValue === "" ||
                                          "here".includes(
                                            searchValue.toLowerCase()
                                          )
                                            ? [
                                                {
                                                  name: "here",
                                                  id: "here",
                                                  avatar: "",
                                                },
                                              ]
                                            : []),
                                          ...chatGroupMembers.filter((m) =>
                                            m.name
                                              .toLowerCase()
                                              .includes(
                                                searchValue.toLowerCase()
                                              )
                                          ),
                                        ];

                                        return (
                                          <>
                                            {filteredMembers.map(
                                              (member, index) => (
                                                <li
                                                  key={member.id}
                                                  onClick={() =>
                                                    handleThreadsPageSelectMention(
                                                      member,
                                                      message.id
                                                    )
                                                  }
                                                  className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
                                                    index ===
                                                    (threadsPageSelectedMentionIndexes[
                                                      key
                                                    ] || 0)
                                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                                      : "hover:bg-gray-100 dark:hover:bg-[#111]"
                                                  }`}
                                                >
                                                  {member.name === "here" ? (
                                                    <>
                                                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">
                                                          @
                                                        </span>
                                                      </div>
                                                      <div className="text-sm font-medium">
                                                        @here
                                                      </div>
                                                      <div className="text-xs text-gray-500 ml-auto">
                                                        Tag everyone
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <img
                                                        src={member.avatar}
                                                        alt={member.name}
                                                        className="w-6 h-6 rounded-full"
                                                      />
                                                      <div className="text-sm">
                                                        {member.name}
                                                      </div>
                                                    </>
                                                  )}
                                                </li>
                                              )
                                            )}

                                            {/* If no matches */}
                                            {filteredMembers.length === 0 &&
                                              searchValue !== "" &&
                                              !"here".includes(
                                                searchValue.toLowerCase()
                                              ) && (
                                                <li className="text-sm text-gray-500 px-2 py-1">
                                                  No members found
                                                </li>
                                              )}
                                          </>
                                        );
                                      })()}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}

                            <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">
                              <Icon icon="mdi:paperclip" width="20" />
                              <input
                                ref={(el) => {
                                  threadsPageFileInputRefs.current[
                                    getThreadsPageReplyKey(message.id)
                                  ] = el;
                                }}
                                type="file"
                                accept="*/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const key = getThreadsPageReplyKey(
                                      message.id
                                    );
                                    setThreadsPageAttachedFiles((prev) => ({
                                      ...prev,
                                      [key]: file,
                                    }));
                                    if (file.type.startsWith("image/")) {
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        setThreadsPageAttachedPreviewUrls(
                                          (prev) => ({
                                            ...prev,
                                            [key]: e.target.result,
                                          })
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }}
                              />
                            </label>

                            {/* Voice record icon */}
                            <button
                              onClick={() => {
                                const key = getThreadsPageReplyKey(message.id);
                                if (!threadsPageIsRecordingAudio[key]) {
                                  // Start recording
                                  handleThreadsPageStartAudio(message.id);
                                } else if (threadsPageIsPaused[key]) {
                                  // Resume recording
                                  handleThreadsPagePauseResumeAudio(message.id);
                                } else {
                                  // Pause recording
                                  handleThreadsPagePauseResumeAudio(message.id);
                                }
                              }}
                              className={`${
                                threadsPageIsRecordingAudio[
                                  getThreadsPageReplyKey(message.id)
                                ]
                                  ? "text-red-500"
                                  : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                              } transition-colors`}
                            >
                              <Icon
                                icon={
                                  !threadsPageIsRecordingAudio[
                                    getThreadsPageReplyKey(message.id)
                                  ]
                                    ? "mdi:microphone"
                                    : threadsPageIsPaused[
                                        getThreadsPageReplyKey(message.id)
                                      ]
                                    ? "mdi:play"
                                    : "mdi:pause"
                                }
                                className="w-5 h-5"
                              />
                            </button>

                            {/* Stop recording button - only show when recording */}
                            {threadsPageIsRecordingAudio[
                              getThreadsPageReplyKey(message.id)
                            ] && (
                              <button
                                onClick={() =>
                                  handleThreadsPageStopAudio(message.id)
                                }
                                className="text-red-600 hover:text-red-700 transition-colors"
                                title="Stop recording"
                              >
                                <Icon icon="mdi:stop" className="w-5 h-5" />
                              </button>
                            )}

                            {/* Video record icon */}
                            <button
                              onClick={() =>
                                threadsPageIsRecordingVideo[
                                  getThreadsPageReplyKey(message.id)
                                ]
                                  ? handleThreadsPageStopVideo(message.id)
                                  : handleThreadsPageStartVideo(message.id)
                              }
                              className={`${
                                threadsPageIsRecordingVideo[
                                  getThreadsPageReplyKey(message.id)
                                ]
                                  ? "text-red-500"
                                  : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                              } transition-colors`}
                            >
                              <Icon icon="mdi:video" className="w-5 h-5" />
                            </button>

                            {/* Send */}
                            <button
                              onClick={() =>
                                handleThreadsPageSubmitReply(message)
                              }
                              className="ml-auto"
                            >
                              <Icon
                                icon="material-symbols-light:send-rounded"
                                width="24"
                                className="text-[#3F0E40]"
                              />
                            </button>
                          </div>

                          {/* 🔹 Threads Page Recording indicator with animated waves */}
                          {threadsPageIsRecordingAudio[
                            getThreadsPageReplyKey(message.id)
                          ] && (
                            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg mt-2">
                              <div className="flex items-center gap-3">
                                {/* Pause/Resume Button */}
                                <button
                                  onClick={() =>
                                    handleThreadsPagePauseResumeAudio(
                                      message.id
                                    )
                                  }
                                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <Icon
                                    icon={
                                      threadsPageIsPaused[
                                        getThreadsPageReplyKey(message.id)
                                      ]
                                        ? "mdi:play"
                                        : "mdi:pause"
                                    }
                                    width="16"
                                  />
                                </button>

                                {/* Waveform */}
                                <div className="flex items-center gap-1 flex-1">
                                  {[...Array(8)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 bg-red-500 rounded-full transition-all duration-300 ${
                                        !threadsPageIsPaused[
                                          getThreadsPageReplyKey(message.id)
                                        ]
                                          ? "animate-pulse"
                                          : ""
                                      }`}
                                      style={{
                                        height: `${Math.random() * 20 + 10}px`,
                                        animationDelay: `${i * 0.1}s`,
                                      }}
                                    />
                                  ))}
                                </div>

                                {/* Stop Button */}
                                <button
                                  onClick={() =>
                                    handleThreadsPageStopAudio(message.id)
                                  }
                                  className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                                >
                                  <Icon icon="mdi:stop" width="16" />
                                </button>
                              </div>

                              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                                {threadsPageIsPaused[
                                  getThreadsPageReplyKey(message.id)
                                ]
                                  ? "Recording paused"
                                  : "Recording audio..."}
                              </div>
                            </div>
                          )}

                          {/* 🔹 Threads Page Video Recording Preview */}
                          {threadsPageIsRecordingVideo[
                            getThreadsPageReplyKey(message.id)
                          ] && (
                            <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                  <Icon icon="mdi:video" width="16" />
                                </div>

                                <div className="flex-1">
                                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Recording video...
                                  </div>
                                  <div className="text-xs text-blue-500 dark:text-blue-300">
                                    Click stop to finish recording
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    handleThreadsPageStopVideo(message.id)
                                  }
                                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                  <Icon icon="mdi:stop" width="16" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </>
          ) : activeUser ? (
            <>
              {/* ✅ Content depending on tab */}
              {activeTab === "messages" && (
                <>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-0">
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
                  {(messages[activeUser.id]?.messages || []).map((msg) => {
                    const isRight = msg.align === "right";
                    return (
                      <div
                        key={msg.id}
                        data-message-id={msg.id}
                        className={`flex ${
                          isRight ? "justify-end" : "justify-start"
                        } group relative ${
                          highlightedMessageId === msg.id ||
                          highlightedFileId === msg.id
                            ? "bg-emerald-100 dark:bg-emerald-900 rounded-lg p-2 -m-2"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
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
                              className="w-8 h-8 rounded-xl flex-shrink-0 self-start shadow"
                            />
                          )}

                          <div className="flex flex-col">
                            {/* Message bubble */}
                            <div
                              className={`flex flex-col p-3 rounded-xl shadow-sm relative ${
                                isRight
                                  ? "bg-[#3F0E40] text-white"
                                  : "bg-white dark:bg-[#2C2C2E] text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-xs">
                                  {msg.name}
                                </span>
                                <span className="text-[10px] opacity-70">
                                  {msg.time}
                                </span>
                              </div>

                              {/* message attachments (images, files, or voice messages) */}
                              {msg.attachments?.length > 0 && (
                                <div className="space-y-0">
                                  {msg.attachments.map((att, i) => (
                                    <div key={i} className="inline-block">
                                      {att.type?.startsWith("image/") ? (
                                        <img
                                          src={att.url}
                                          alt={att.name}
                                          className="max-w-xs rounded-md shadow mt-1"
                                        />
                                      ) : att.type?.startsWith("audio/") ? (
                                        <VoiceMessageComponent
                                          audioUrl={att.url}
                                          duration={att.duration || 0}
                                          isRight={isRight}
                                        />
                                      ) : att.type?.startsWith("video/") ? (
                                        <video
                                          controls
                                          src={att.url}
                                          className="max-w-xs rounded-md shadow mt-1"
                                          preload="metadata"
                                        />
                                      ) : (
                                        <a
                                          href={att.url}
                                          download={att.name}
                                          className="inline-flex items-center text-black gap-2 px-3 py-2 bg-gray-200 dark:bg-[#111] border rounded text-sm hover:underline"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Icon
                                            icon={getFileIcon(att)}
                                            width="18"
                                          />
                                          <span>{att.name}</span>
                                          <span className="text-xs opacity-60">
                                            ·{" "}
                                            {Math.round((att.size || 0) / 1024)}{" "}
                                            KB
                                          </span>
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Edit Mode */}
                              {editingMessageId === msg.id ? (
                                <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0B0B0B] shadow-sm">
                                  <style>{`
                                    .edit-message-quill .ql-toolbar {
                                      background-color: #f3f4f6 !important;
                                      border-bottom: 1px solid #e5e7eb !important;
                                    }
                                    .edit-message-quill .ql-container {
                                      background-color: white !important;
                                    }
                                    .edit-message-quill .ql-editor {
                                      color: #1f2937 !important;
                                    }
                                  `}</style>
                                  <ReactQuill
                                    ref={(el) => {
                                      editMessageQuillRef.current = el;
                                    }}
                                    theme="snow"
                                    value={editingMessageText}
                                    onChange={setEditingMessageText}
                                    modules={editReplyModules}
                                    placeholder="Edit your message..."
                                    className="border-0 edit-message-quill"
                                    style={{
                                      backgroundColor: "white",
                                    }}
                                  />
                                  <div className="flex justify-between items-center px-3 py-2 bg-white dark:bg-[#0B0B0B]">
                                    <button
                                      onClick={() =>
                                        setShowEditEmojiPicker((prev) => !prev)
                                      }
                                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                                    >
                                      <Icon
                                        icon="fluent:emoji-16-regular"
                                        width="20"
                                      />
                                    </button>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={handleCancelEditMessage}
                                        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleSaveEditMessage}
                                        className="px-3 py-1 text-xs font-medium text-white bg-[#724875] hover:bg-[#5a3a5c] rounded transition-colors"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="quill-content max-w-none text-sm dark:text-white"
                                  dangerouslySetInnerHTML={{ __html: msg.text }}
                                />
                              )}

                              {/* Emoji picker for edit mode */}
                              {editingMessageId === msg.id &&
                                showEditEmojiPicker && (
                                  <div className="absolute -top-16 right-4 z-[9999] emoji-picker-container">
                                    <Picker
                                      onEmojiClick={
                                        handleEditMessageEmojiSelect
                                      }
                                      theme="light"
                                    />
                                  </div>
                                )}

                              {/* 3-dot menu - appears on hover inside message bubble */}
                              {hoveredMessageId === msg.id &&
                                editingMessageId !== msg.id && (
                                  <div className="message-menu-container absolute top-2 right-2">
                                    <button
                                      onClick={() =>
                                        setShowMessageMenu(
                                          showMessageMenu === msg.id
                                            ? null
                                            : msg.id
                                        )
                                      }
                                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                                        isRight
                                          ? "hover:bg-[#724875] hover:bg-opacity-20"
                                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                      }`}
                                    >
                                      <Icon
                                        icon="mdi:dots-vertical"
                                        className="w-4 h-4 text-gray-500"
                                      />
                                    </button>

                                    {/* Dropdown menu */}
                                    {showMessageMenu === msg.id && (
                                      <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-50 min-w-[150px]">
                                        {/* Edit option - only for text messages */}
                                        {!msg.attachments?.length && (
                                          <button
                                            onClick={() =>
                                              handleEditMessage(msg.id)
                                            }
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                          >
                                            <Icon
                                              icon="mdi:pencil"
                                              className="w-4 h-4"
                                            />
                                            Edit message
                                          </button>
                                        )}
                                        {/* Delete option - for all messages */}
                                        <button
                                          onClick={() =>
                                            handleDeleteMessage(msg.id)
                                          }
                                          className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                          <Icon
                                            icon="mdi:delete"
                                            className="w-4 h-4"
                                          />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 mt-1 ml-2 text-xs">
                              {/* ✅ Existing reactions */}
                              {msg.reactions?.map((r, idx) => (
                                <button
                                  key={idx}
                                  onClick={() =>
                                    handleRemoveReaction(
                                      activeUser.id,
                                      msg.id,
                                      r.emoji
                                    )
                                  }
                                  className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition border border-blue-200 dark:border-blue-700"
                                >
                                  <span>{r.emoji}</span>
                                  <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                                    {r.count}
                                  </span>
                                </button>
                              ))}

                              {/* ✅ Emoji picker */}
                              <details className="relative">
                                <summary className="list-none cursor-pointer  py-1">
                                  <Smile className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </summary>

                                <div
                                  className={`absolute z-50 -top-12 bg-white dark:bg-[#0B0B0B] p-2 rounded-full shadow-lg flex gap-1 items-center ${
                                    isRight ? "right-0" : "left-0"
                                  }`}
                                >
                                  {["👍", "❤️", "😂", "😮", "😢", "🙏"].map(
                                    (emo) => (
                                      <button
                                        key={emo}
                                        onClick={(e) => {
                                          handleAddReaction(
                                            activeUser.id,
                                            msg.id,
                                            emo
                                          );
                                          const det =
                                            e.currentTarget.closest("details");
                                          if (det) det.open = false;
                                        }}
                                        className="p-1 text-base leading-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors hover:scale-110"
                                      >
                                        {emo}
                                      </button>
                                    )
                                  )}
                                </div>
                              </details>

                              {/* ✅ Reply (available for all chats) */}
                              <button
                                onClick={() => openReplyBox(msg.id)}
                                className="text-gray-500 hover:text-gray-700 px-2"
                              >
                                Reply
                              </button>

                              {/* ✅ View threads (only if replies exist) */}
                              {msg.replies?.length > 0 && (
                                <button
                                  onClick={() => openThread(msg.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  View threads ({msg.replies.length})
                                </button>
                              )}

                              {/* ✅ Pin button (for all chats) */}
                              <button
                                onClick={() =>
                                  handlePinMessage(activeUser.id, msg)
                                }
                                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2"
                              >
                                <Icon icon="mdi:pin-outline" width="14" />
                                Pin
                              </button>
                            </div>
                          </div>

                          {isRight && (
                            <img
                              src={currentUser.avatar}
                              alt="You"
                              className="w-8 h-8 rounded-xl flex-shrink-0 self-start shadow"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {activeTab === "files" && (
                <div className="text-center text-gray-500 text-sm mt-6">
                  {(messages[activeUser.id]?.files || []).length > 0 ? (
                    <ul className="space-y-2">
                      {messages[activeUser.id].files
                        .filter(Boolean) // safeguard: remove null/undefined
                        .map((file, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-white dark:bg-[#2C2C2E] rounded shadow-sm"
                          >
                            {/* use file, not attachedFile */}
                            <Icon icon={getFileIcon(file)} width="20" />
                            <a
                              href={file.url}
                              download={file.name}
                              className="text-blue-500 hover:underline text-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    "No files shared yet."
                  )}
                </div>
              )}

              {activeTab === "pins" && (
                <div className="text-center text-gray-500 text-sm mt-6">
                  {(messages[activeUser.id]?.pins || []).length > 0 ? (
                    <ul className="space-y-4">
                      {messages[activeUser.id].pins.map((pin) => (
                        <li
                          key={pin.id}
                          className={`flex ${
                            pin.align === "right"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex gap-2 max-w-lg ${
                              pin.align === "right" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <img
                              src={
                                activeUser.isGroup
                                  ? users.find((u) => u.name === pin.name)
                                      ?.avatar || activeUser.avatar
                                  : activeUser.avatar
                              }
                              alt={pin.name}
                              className="w-8 h-8 rounded-xl flex-shrink-0 self-start shadow"
                            />

                            <div className="flex flex-col">
                              <div
                                className={`flex flex-col p-3 rounded-xl shadow-sm ${
                                  pin.align === "right"
                                    ? "bg-[#3F0E40] text-white"
                                    : "bg-white dark:bg-[#2C2C2E] text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {/* Header */}
                                <div className="flex items-center gap-2 justify-between mb-1">
                                  <span className="font-semibold text-xs">
                                    {pin.name}
                                  </span>
                                  <span className="text-[10px] opacity-70">
                                    {pin.time}
                                  </span>
                                </div>

                                {/* Message text */}
                                <div
                                  className="quill-content max-w-none text-sm dark:text-white"
                                  dangerouslySetInnerHTML={{ __html: pin.text }}
                                />

                                {/* Attachments if any */}
                                {pin.attachments?.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {pin.attachments.map((att, idx) => (
                                      <div key={idx} className="inline-block">
                                        {att.type?.startsWith("image/") ? (
                                          <img
                                            src={att.url}
                                            alt={att.name}
                                            className="max-w-xs rounded-md shadow mt-1"
                                          />
                                        ) : att.type?.startsWith("audio/") ? (
                                          <VoiceMessageComponent
                                            audioUrl={att.url}
                                            duration={att.duration || 0}
                                            isRight={pin.align === "right"}
                                          />
                                        ) : att.type?.startsWith("video/") ? (
                                          <video
                                            controls
                                            src={att.url}
                                            className="max-w-xs rounded-md shadow mt-1"
                                            preload="metadata"
                                          />
                                        ) : (
                                          <a
                                            href={att.url}
                                            download={att.name}
                                            className="inline-flex items-center text-black gap-2 px-3 py-2 bg-gray-200 dark:bg-[#111] border rounded text-sm hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Icon
                                              icon={getFileIcon(att)}
                                              width="18"
                                            />
                                            <span>{att.name}</span>
                                            <span className="text-xs opacity-60">
                                              ·{" "}
                                              {Math.round(
                                                (att.size || 0) / 1024
                                              )}{" "}
                                              KB
                                            </span>
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* ✅ Action row (bottom of pinned msg) */}
                              <div className="flex items-center gap-2 mt-1 ml-2 text-xs">
                                <button
                                  onClick={() =>
                                    handleUnpinMessage(activeUser.id, pin.id)
                                  }
                                  className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2"
                                >
                                  <Icon icon="mdi:pin-off" width="14" />
                                  Unpin
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No pinned messages."
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Select a user to start chatting
            </div>
          )}
        </div>

        {/* Thread panel (right-side) */}
        {threadOpen && threadMsg && (
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-[#0B0B0B] border-l border-gray-200 z-50 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Thread
              </h3>
              <button
                onClick={() => closeThread()}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Close thread"
              >
                <Icon icon="mdi:close" width="20" />
              </button>
            </div>

            {/* Edit Mode Emoji Picker - positioned outside overflow container */}
            {showEditEmojiPicker && (
              <div className="absolute bottom-20 left-4 z-[9999] emoji-picker-container">
                <Picker onEmojiClick={handleEditEmojiSelect} theme="light" />
              </div>
            )}

            <div
              ref={threadScrollRef}
              className="overflow-y-auto flex-1 space-y-3 pr-2"
            >
              {/* main message */}
              <div className="p-3 bg-gray-100 dark:bg-[#1B1B1B] rounded">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{threadMsg.name}</div>
                  <div className="text-[10px] opacity-70">{threadMsg.time}</div>
                </div>
                <div
                  className="quill-content max-w-none text-sm dark:text-white mt-2"
                  dangerouslySetInnerHTML={{ __html: threadMsg.text }}
                />

                {/* Reactions for main message in thread */}
                {threadMsg.reactions && threadMsg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {threadMsg.reactions.map((reaction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-2 py-1 text-blue-600 dark:text-blue-400"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                        <span className="text-xs font-medium">
                          {reaction.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* replies list */}
              <div className="mt-2 space-y-3">
                {(threadMsg.replies || []).map((r) => (
                  <div
                    key={r.id}
                    data-message-id={r.id}
                    className={`group flex items-start gap-3 relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${
                      highlightedMessageId === r.id ||
                      highlightedFileId === r.id
                        ? "bg-emerald-100 dark:bg-emerald-900"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredReplyId(r.id)}
                    onMouseLeave={() => setHoveredReplyId(null)}
                  >
                    <img
                      src={
                        users.find((u) => u.name === r.name)?.avatar ||
                        currentUser?.avatar
                      }
                      alt={r.name}
                      className="w-8 h-8 rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{r.name}</div>
                        <div className="text-[11px] opacity-70">{r.time}</div>
                      </div>

                      {/* Edit Mode */}
                      {editingReplyId === r.id ? (
                        <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0B0B0B] shadow-sm">
                          <style>{`
                            .edit-reply-quill .ql-toolbar {
                              background-color: #f3f4f6 !important;
                              border-bottom: 1px solid #e5e7eb !important;
                            }
                            .edit-reply-quill .ql-container {
                              background-color: white !important;
                            }
                            .edit-reply-quill .ql-editor {
                              color: #1f2937 !important;
                            }
                          `}</style>
                          <ReactQuill
                            ref={(el) => {
                              editReplyQuillRef.current = el;
                            }}
                            theme="snow"
                            value={editingReplyText}
                            onChange={setEditingReplyText}
                            modules={editReplyModules}
                            placeholder="Edit your message..."
                            className="border-0 edit-reply-quill"
                            style={{
                              backgroundColor: "white",
                            }}
                          />
                          <div className="flex justify-between items-center px-3 py-2 bg-white dark:bg-[#0B0B0B]">
                            <button
                              onClick={() =>
                                setShowEditEmojiPicker((prev) => !prev)
                              }
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                            >
                              <Icon icon="fluent:emoji-16-regular" width="20" />
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCancelEditReply}
                                className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEditReply}
                                className="px-3 py-1 text-xs font-medium text-white bg-[#724875] hover:bg-[#5a3a5c] rounded transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="quill-content max-w-none text-sm dark:text-white mt-1"
                          dangerouslySetInnerHTML={{ __html: r.text }}
                        />
                      )}

                      {/* Thread Reply Attachments */}
                      {r.attachments && r.attachments.length > 0 && (
                        <div className="space-y-1">
                          {r.attachments.map((att, idx) => (
                            <div key={idx}>
                              {/* Audio attachment */}
                              {att.type?.startsWith("audio/") && (
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                                  <VoiceMessageComponent
                                    audioUrl={att.url}
                                    duration={att.duration || 0}
                                    isRight={false}
                                  />
                                </div>
                              )}

                              {/* Video attachment */}
                              {att.type?.startsWith("video/") && (
                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-sm">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Icon
                                      icon="mdi:video"
                                      className="w-4 h-4 text-red-600"
                                    />
                                    <span className="text-xs font-medium">
                                      Video Message
                                    </span>
                                  </div>
                                  <video controls className="w-full rounded">
                                    <source src={att.url} type={att.type} />
                                    Your browser does not support video
                                    playback.
                                  </video>
                                </div>
                              )}

                              {/* Image attachment */}
                              {att.type?.startsWith("image/") && (
                                <div className="max-w-xs">
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="rounded-lg max-w-full h-auto"
                                  />
                                </div>
                              )}

                              {/* File attachment */}
                              {!att.type?.startsWith("audio/") &&
                                !att.type?.startsWith("video/") &&
                                !att.type?.startsWith("image/") && (
                                  <a
                                    href={att.url}
                                    download={att.name}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 border rounded text-sm hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Icon icon={getFileIcon(att)} width="18" />
                                    <span>{att.name}</span>
                                    <span className="text-xs opacity-60">
                                      · {Math.round((att.size || 0) / 1024)} KB
                                    </span>
                                  </a>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3-dot menu - appears on hover */}
                    {hoveredReplyId === r.id && editingReplyId !== r.id && (
                      <div className="reply-menu-container">
                        <button
                          onClick={() =>
                            setShowReplyMenu(
                              showReplyMenu === r.id ? null : r.id
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <Icon
                            icon="mdi:dots-vertical"
                            className="w-4 h-4 text-gray-500"
                          />
                        </button>

                        {/* Dropdown menu */}
                        {showReplyMenu === r.id && (
                          <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-50 min-w-[150px]">
                            {/* Show edit option only for text messages (not voice/video) */}
                            {(!r.attachments ||
                              r.attachments.length === 0 ||
                              !r.attachments.some(
                                (att) =>
                                  att.type?.startsWith("audio/") ||
                                  att.type?.startsWith("video/")
                              )) && (
                              <button
                                onClick={() => handleEditReply(r.id, r.text)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Icon icon="mdi:pencil" className="w-4 h-4" />
                                Edit message
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReply(r.id)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                              <Icon icon="mdi:delete" className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Thread Input with all features */}
            <div className="relative mt-3">
              {threadShowEmojiPicker && (
                <div className="absolute bottom-[60px] left-4 z-50">
                  <Picker
                    onEmojiClick={handleThreadEmojiSelect}
                    theme="light"
                  />
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000000] flex flex-col gap-1 shadow-lg">
                {/* Rich Text Editor for Thread */}
                <ReactQuill
                  ref={(el) => {
                    threadQuillRef.current = el;
                  }}
                  theme="snow"
                  value={threadReplyText}
                  onChange={(newValue) => {
                    setThreadReplyText(newValue);
                    // Auto-open mention list when @ is typed in thread reply
                    if (
                      activeUser?.isGroup &&
                      newValue.includes("@") &&
                      !threadShowMentionList
                    ) {
                      const atIndex = newValue.lastIndexOf("@");
                      const afterAt = newValue.substring(atIndex + 1);
                      if (
                        atIndex >= 0 &&
                        (!afterAt || afterAt === " " || !afterAt.match(/^\w/))
                      ) {
                        setTimeout(() => {
                          if (!threadShowMentionList) {
                            setThreadShowMentionList(true);
                            setThreadMentionSearch("");
                            setThreadSelectedMentionIndex(0);
                          }
                        }, 100);
                      }
                    }
                  }}
                  modules={modules}
                  placeholder="Reply to thread..."
                  className="chat-editor rounded-lg dark:bg-[#000000] dark:text-white shadow-sm"
                />

                {/* Thread Attachment preview */}
                {threadAttachedFile && (
                  <div className="flex items-center gap-3 border rounded p-2 bg-gray-50 dark:bg-[#111] mb-1">
                    {threadAttachedPreviewUrl &&
                    threadAttachedFile.type.startsWith("image/") ? (
                      <img
                        src={threadAttachedPreviewUrl}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Icon
                          icon={getFileIcon(threadAttachedFile)}
                          width="20"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {threadAttachedFile.name}
                          </span>
                          <span className="text-xs opacity-70">
                            {Math.round(threadAttachedFile.size / 1024)} KB
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setThreadAttachedFile(null);
                        setThreadAttachedPreviewUrl(null);
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Thread Voice Message Preview */}
                {threadAudioBlob && !threadIsRecordingAudio && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <VoicePreviewComponent
                        audioBlob={threadAudioBlob}
                        duration={recordingDuration || 0}
                        onDelete={() => setThreadAudioBlob(null)}
                      />
                    </div>
                  </div>
                )}

                {/* Thread Video Message Preview */}
                {threadVideoBlob && !threadIsRecordingVideo && (
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <video
                        controls
                        src={URL.createObjectURL(threadVideoBlob)}
                        className="flex-1 max-h-64 rounded"
                      />
                      <button
                        onClick={() => setThreadVideoBlob(null)}
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Delete video"
                      >
                        <Icon icon="mdi:delete" width="16" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Thread Action row: emoji, mention, attach, send */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setThreadShowEmojiPicker((prev) => !prev)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                  >
                    <Icon icon="fluent:emoji-16-regular" width="20" />
                  </button>

                  {activeUser?.isGroup && (
                    <>
                      <button
                        ref={threadMentionButtonRef}
                        onClick={() => setThreadShowMentionList((p) => !p)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                        aria-haspopup="listbox"
                        aria-expanded={threadShowMentionList}
                        title="Mention someone"
                      >
                        <Icon icon="fluent:mention-16-regular" width="20" />
                      </button>

                      {/* Thread Mention dropdown */}
                      {threadShowMentionList && (
                        <div
                          ref={threadMentionListRef}
                          className="absolute bottom-[60px] left-12 z-50 w-64 bg-white dark:bg-[#0B0B0B] border rounded shadow p-2"
                        >
                          {/* Search input */}
                          <input
                            value={threadMentionSearch}
                            onChange={(e) => {
                              setThreadMentionSearch(e.target.value);
                              setThreadSelectedMentionIndex(0);
                            }}
                            placeholder="Search members..."
                            className="w-full px-2 py-1 rounded border border-[#3F0E40] mb-2 text-sm bg-white dark:bg-[#111] dark:text-white focus:outline-none focus:ring-0"
                            autoFocus
                          />

                          {/* Members list */}
                          <ul className="max-h-48 overflow-auto">
                            {(() => {
                              const filteredMembers = [
                                ...(threadMentionSearch === "" ||
                                "here".includes(
                                  threadMentionSearch.toLowerCase()
                                )
                                  ? [{ name: "here", id: "here", avatar: "" }]
                                  : []),
                                ...groupMembers.filter((m) =>
                                  m.name
                                    .toLowerCase()
                                    .includes(threadMentionSearch.toLowerCase())
                                ),
                              ];

                              return filteredMembers.map((member, index) => (
                                <li
                                  key={member.id}
                                  onClick={() =>
                                    handleThreadSelectMention(member)
                                  }
                                  className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
                                    index === threadSelectedMentionIndex
                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                      : "hover:bg-gray-100 dark:hover:bg-[#111]"
                                  }`}
                                >
                                  {member.name === "here" ? (
                                    <>
                                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                          @
                                        </span>
                                      </div>
                                      <div className="text-sm font-medium">
                                        @here
                                      </div>
                                      <div className="text-xs text-gray-500 ml-auto">
                                        Tag everyone
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-6 h-6 rounded-full"
                                      />
                                      <div className="text-sm">
                                        {member.name}
                                      </div>
                                    </>
                                  )}
                                </li>
                              ));
                            })()}

                            {/* If no matches */}
                            {groupMembers.filter((m) =>
                              m.name
                                .toLowerCase()
                                .includes(threadMentionSearch.toLowerCase())
                            ).length === 0 &&
                              threadMentionSearch !== "" &&
                              !"here".includes(
                                threadMentionSearch.toLowerCase()
                              ) && (
                                <li className="text-sm text-gray-500 px-2 py-1">
                                  No members found
                                </li>
                              )}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">
                    <Icon icon="mdi:paperclip" width="20" />
                    <input
                      ref={threadFileInputRef}
                      type="file"
                      accept="*/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setThreadAttachedFile(file);
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onload = (e) =>
                              setThreadAttachedPreviewUrl(e.target.result);
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                  </label>

                  {/* Voice record icon */}
                  <button
                    onClick={() => {
                      if (!threadIsRecordingAudio) {
                        // Start recording
                        handleThreadStartAudio();
                      } else if (threadIsPaused) {
                        // Resume recording
                        handleThreadPauseResumeAudio();
                      } else {
                        // Pause recording
                        handleThreadPauseResumeAudio();
                      }
                    }}
                    className={`${
                      threadIsRecordingAudio
                        ? "text-red-500"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    } transition-colors`}
                  >
                    <Icon
                      icon={
                        !threadIsRecordingAudio
                          ? "mdi:microphone"
                          : threadIsPaused
                          ? "mdi:play"
                          : "mdi:pause"
                      }
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Stop recording button - only show when recording */}
                  {threadIsRecordingAudio && (
                    <button
                      onClick={handleThreadStopAudio}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Stop recording"
                    >
                      <Icon icon="mdi:stop" className="w-5 h-5" />
                    </button>
                  )}

                  {/* Video record icon */}
                  <button
                    onClick={() =>
                      threadIsRecordingVideo
                        ? handleThreadStopVideo()
                        : handleThreadStartVideo()
                    }
                    className={`${
                      threadIsRecordingVideo
                        ? "text-red-500"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    } transition-colors`}
                  >
                    <Icon icon="mdi:video" className="w-5 h-5" />
                  </button>

                  {/* Send */}
                  <button onClick={handleThreadSend} className="ml-auto">
                    <Icon
                      icon="material-symbols-light:send-rounded"
                      width="24"
                      className="text-[#3F0E40]"
                    />
                  </button>
                </div>

                {/* 🔹 Thread Recording indicator with animated waves */}
                {threadIsRecordingAudio && (
                  <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg mt-2">
                    <div className="flex items-center gap-3">
                      {/* Pause/Resume Button */}
                      <button
                        onClick={handleThreadPauseResumeAudio}
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Icon
                          icon={threadIsPaused ? "mdi:play" : "mdi:pause"}
                          width="16"
                        />
                      </button>

                      {/* Waveform */}
                      <div className="flex items-center gap-1 flex-1">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-red-500 rounded-full transition-all duration-300 ${
                              !threadIsPaused ? "animate-pulse" : ""
                            }`}
                            style={{
                              height: `${Math.random() * 20 + 10}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Stop Button */}
                      <button
                        onClick={handleThreadStopAudio}
                        className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <Icon icon="mdi:stop" width="16" />
                      </button>
                    </div>

                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {threadIsPaused
                        ? "Recording paused"
                        : "Recording audio..."}
                    </div>
                  </div>
                )}

                {/* 🔹 Thread Video Recording Preview */}
                {threadIsRecordingVideo && (
                  <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Recording Video...
                      </span>
                      <button
                        onClick={handleThreadStopVideo}
                        className="ml-auto px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                    <video
                      ref={threadVideoRef}
                      className="w-full max-w-xs rounded-lg"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input Footer */}
        {activeUser && !showThreadsPage && (
          <div className="relative">
            {showEmojiPicker && (
              <div className="absolute bottom-[60px] left-4 z-50">
                <Picker onEmojiClick={handleEmojiSelect} theme="light" />
              </div>
            )}

            <div className="px-4 py-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000000] flex flex-col gap-1 shadow-lg">
              {/* Rich Text Editor */}
              <style>{`
                
                .chat-editor .ql-toolbar {
                  border-radius: 0.5rem 0.5rem 0 0 !important;
                  border: 1px solid #e5e7eb !important;
                  border-bottom: none !important;
                  background-color: #f3f4f6 !important;
                }
                
                .chat-editor .ql-container {
                  border-radius: 0 0 0.5rem 0.5rem !important;
                  border: 1px solid #e5e7eb !important;
                }
              `}</style>
              <ReactQuill
                ref={(el) => {
                  quillRef.current = el;
                }}
                theme="snow"
                value={message}
                onChange={(newValue) => {
                  setMessage(newValue);
                  // Auto-open mention list when @ is typed (but not if it's already a complete mention)
                  if (
                    activeUser?.isGroup &&
                    newValue.includes("@") &&
                    !showMentionList
                  ) {
                    // Check if the @ is at the end or followed by non-word characters
                    const atIndex = newValue.lastIndexOf("@");
                    const afterAt = newValue.substring(atIndex + 1);
                    // Only open if @ is at the end or followed by space/non-word character
                    if (
                      atIndex >= 0 &&
                      (!afterAt || afterAt === " " || !afterAt.match(/^\w/))
                    ) {
                      // Add small delay to prevent conflicts with mention insertion
                      setTimeout(() => {
                        if (!showMentionList) {
                          setShowMentionList(true);
                          setMentionSearch("");
                          setSelectedMentionIndex(0);
                        }
                      }, 100);
                    }
                  }
                }}
                modules={modules}
                placeholder="Type a message"
                className="chat-editor rounded-lg dark:bg-[#000000] dark:text-white shadow-sm"
              />

              {/* Attachment preview */}
              {attachedFile && (
                <div className="flex items-center gap-3 border rounded p-2 bg-gray-50 dark:bg-[#111] mb-1">
                  {attachedPreviewUrl &&
                  attachedFile.type.startsWith("image/") ? (
                    <img
                      src={attachedPreviewUrl}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Icon icon={getFileIcon(attachedFile)} width="20" />
                      <div className="flex flex-col">
                        <span className="font-medium">{attachedFile.name}</span>
                        <span className="text-xs opacity-70">
                          {Math.round(attachedFile.size / 1024)} KB
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="ml-auto text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Action row: emoji, mention, attach, voice, video, send */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                >
                  <Icon icon="fluent:emoji-16-regular" width="20" />
                </button>

                {activeUser?.isGroup && (
                  <>
                    <button
                      ref={mentionButtonRef}
                      onClick={() => setShowMentionList((p) => !p)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
                      aria-haspopup="listbox"
                      aria-expanded={showMentionList}
                      title="Mention someone"
                    >
                      <Icon icon="fluent:mention-16-regular" width="20" />
                    </button>

                    {/* Mention dropdown (positioned like emoji picker) */}
                    {showMentionList && (
                      <div
                        ref={mentionListRef}
                        className="absolute bottom-[80px] left-12 z-50 w-64 bg-white dark:bg-[#0B0B0B] border rounded shadow p-2"
                      >
                        {/* Search input */}
                        <input
                          value={mentionSearch}
                          onChange={(e) => {
                            setMentionSearch(e.target.value);
                            setSelectedMentionIndex(0);
                          }}
                          placeholder="Search members..."
                          className="w-full px-2 py-1 rounded border border-[#3F0E40] mb-2 text-sm bg-white dark:bg-[#111] dark:text-white focus:outline-none focus:ring-0"
                          autoFocus
                        />

                        {/* Members list */}
                        <ul className="max-h-48 overflow-auto">
                          {(() => {
                            const filteredMembers = [
                              ...(mentionSearch === "" ||
                              "here".includes(mentionSearch.toLowerCase())
                                ? [{ name: "here", id: "here", avatar: "" }]
                                : []),
                              ...groupMembers.filter((m) =>
                                m.name
                                  .toLowerCase()
                                  .includes(mentionSearch.toLowerCase())
                              ),
                            ];

                            return filteredMembers.map((member, index) => (
                              <li
                                key={member.id}
                                onClick={() => handleSelectMention(member)}
                                className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
                                  index === selectedMentionIndex
                                    ? "bg-blue-100 dark:bg-blue-900/30"
                                    : "hover:bg-gray-100 dark:hover:bg-[#111]"
                                }`}
                              >
                                {member.name === "here" ? (
                                  <>
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        @
                                      </span>
                                    </div>
                                    <div className="text-sm font-medium">
                                      @here
                                    </div>
                                    <div className="text-xs text-gray-500 ml-auto">
                                      Tag everyone
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <div className="text-sm">{member.name}</div>
                                  </>
                                )}
                              </li>
                            ));
                          })()}

                          {/* If no matches */}
                          {groupMembers.filter((m) =>
                            m.name
                              .toLowerCase()
                              .includes(mentionSearch.toLowerCase())
                          ).length === 0 &&
                            mentionSearch !== "" &&
                            !"here".includes(mentionSearch.toLowerCase()) && (
                              <li className="text-sm text-gray-500 px-2 py-1">
                                No members found
                              </li>
                            )}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <label className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">
                  <Icon icon="mdi:paperclip" width="20" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="*/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAttachedFile(file);
                    }}
                  />
                </label>

                {/* Voice record icon */}
                <button
                  onClick={() => {
                    if (!isRecordingAudio) {
                      // Start recording
                      handleStartAudio();
                    } else if (isPaused) {
                      // Resume recording
                      handlePauseResumeAudio();
                    } else {
                      // Pause recording
                      handlePauseResumeAudio();
                    }
                  }}
                  className={`${
                    isRecordingAudio
                      ? "text-red-500"
                      : "text-gray-700 hover:text-gray-900"
                  } transition-colors`}
                >
                  <Icon
                    icon={
                      !isRecordingAudio
                        ? "mdi:microphone"
                        : isPaused
                        ? "mdi:play"
                        : "mdi:pause"
                    }
                    className="w-5 h-5"
                  />
                </button>

                {/* Stop recording button - only show when recording */}
                {isRecordingAudio && (
                  <button
                    onClick={handleStopAudio}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Stop recording"
                  >
                    <Icon icon="mdi:stop" className="w-5 h-5" />
                  </button>
                )}

                {/* Video record icon */}
                <button
                  onClick={() =>
                    isRecordingVideo ? handleStopVideo() : handleStartVideo()
                  }
                >
                  <Icon icon="mdi:video" className="w-5 h-5 text-gray-700" />
                </button>

                {/* Send */}
                <button onClick={handleSend} className="ml-auto">
                  <Icon
                    icon="material-symbols-light:send-rounded"
                    width="24"
                    className="text-[#3F0E40]"
                  />
                </button>
              </div>

              {/* 🔹 Recording indicator with animated waves */}
              {isRecordingAudio && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Pause/Resume Button */}
                    <button
                      onClick={handlePauseResumeAudio}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Icon
                        icon={isPaused ? "mdi:play" : "mdi:pause"}
                        width="16"
                      />
                    </button>

                    {/* Waveform */}
                    <div className="flex items-center gap-1 flex-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full ${
                            isPaused ? "bg-red-300" : "bg-red-500 animate-pulse"
                          }`}
                          style={{
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.6s",
                          }}
                        />
                      ))}
                    </div>

                    {/* Recording Status */}
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {isPaused ? "Paused" : "Recording..."}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={handleDeleteAudio}
                      className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <Icon icon="mdi:delete" width="16" />
                    </button>

                    {/* Stop Button */}
                    <button
                      onClick={handleStopAudio}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <Icon icon="mdi:stop" width="16" />
                    </button>
                  </div>
                </div>
              )}

              {/* 🔹 Recording indicator while recording video */}
              {isRecordingVideo && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Pause/Resume */}
                    <button
                      onClick={handlePauseResumeVideo}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      title={isVideoPaused ? "Resume" : "Pause"}
                    >
                      <Icon
                        icon={isVideoPaused ? "mdi:play" : "mdi:pause"}
                        width="16"
                      />
                    </button>

                    {/* Live preview */}
                    <div className="relative h-20 w-32 rounded-md bg-black flex items-center justify-center">
                      <video
                        ref={videoPreviewRef}
                        className="h-full w-full rounded-md object-cover"
                        playsInline
                        muted
                        autoPlay
                        style={{ minWidth: "128px", minHeight: "80px" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black bg-opacity-50 rounded-md">
                        Camera Preview
                      </div>
                    </div>

                    {/* Status */}
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {isVideoPaused ? "Paused" : "Recording..."}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={handleDeleteVideo}
                      className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                      title="Delete recording"
                    >
                      <Icon icon="mdi:delete" width="16" />
                    </button>

                    {/* Stop */}
                    <button
                      onClick={handleStopVideo}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                      title="Stop recording"
                    >
                      <Icon icon="mdi:stop" width="16" />
                    </button>
                  </div>
                </div>
              )}

              {/* 🔹 Voice Message Preview with Waveform */}
              {audioBlob && !isRecordingAudio && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <VoicePreviewComponent
                      audioBlob={audioBlob}
                      duration={recordingDuration}
                      onDelete={handleDeleteAudio}
                    />
                  </div>
                </div>
              )}

              {/* 🔹 Playback for recorded video */}
              {videoBlob && !isRecordingVideo && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <video
                      controls
                      src={URL.createObjectURL(videoBlob)}
                      className="flex-1 max-h-64 rounded"
                    />
                    <button
                      onClick={handleDeleteVideo}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Delete video"
                    >
                      <Icon icon="mdi:delete" width="16" />
                    </button>
                  </div>
                </div>
              )}
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
              {activeUser.isGroup ? (
                <h2 className="text-2xl dark:text-white font-semibold mb-3">
                  #{activeUser.name}
                </h2>
              ) : (
                <>
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-24 h-24 rounded-full mb-3"
                  />
                  <h2 className="text-lg dark:text-white font-semibold">
                    {activeUser.name}
                  </h2>
                </>
              )}
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
                    ? "bg-[#3F0E40] text-white"
                    : "bg-white dark:bg-[#0D0D0D] border-[#3F0E40] dark:border-[#3F0E40] text-[#3F0E40] dark:text-[#3F0E40]"
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

            <div className="flex flex-col pr-3 gap-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
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
                      className="flex items-center justify-between gap-3 cursor-pointer hover:bg-[#3F0E40] hover:text-white p-2 rounded"
                      onClick={() => {
                        setChannels((prev) =>
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
                          className="w-8 h-8 rounded-xl"
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
                        className="w-8 h-8 rounded-xl"
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
            <h2 className="text-lg dark:text-white font-semibold mb-2">
              Create Channel
            </h2>

            {/* Group Name */}
            <label
              htmlFor="groupName"
              className="block text-[12px] pl-1 text-[#6F7C74] dark:text-[#A9C2B3] mb-1"
            >
              Channel Name
            </label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter channel name"
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
                A channel with this name already exists.
              </p>
            )}
            {isGroupNameEmpty && (
              <p className="text-red-500 text-xs mt-1">
                Channel name is required.
              </p>
            )}

            {/* Select Members */}
            <div className="mt-4">
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
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-2 mt-4">
              <button
                onClick={() => setGroupModalOpen(false)}
                className="w-full px-3 py-2 rounded-lg border border-[#3F0E40] text-[#3F0E40] hover:bg-[#3F0E401A] dark:hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newGroupName.trim() === "") {
                    setIsGroupNameEmpty(true);
                    return;
                  }
                  setIsGroupNameEmpty(false);
                  if (isDuplicateGroupName) {
                    return;
                  }
                  handleCreateGroup();
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#3F0E40] text-white hover:bg-[#350D36]"
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
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3F0E40] dark:bg-[#0D0D0D] dark:text-white"
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
                    className="flex items-center gap-3 px-4 py-2 mb-1 cursor-pointer hover:bg-[#3F0E40] hover:text-white rounded-md"
                    onClick={() => {
                      handleUserClick(user);
                      setNewChatModalOpen(false);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl"
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
