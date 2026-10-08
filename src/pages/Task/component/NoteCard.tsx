import React, { useState } from "react";
import { Trash2, GripVertical, Check, X } from "lucide-react";
import { Icon } from "@iconify/react";

interface NoteCardProps {
  title: string;
  description: string;
  onDelete: () => void;
  onSave?: (title: string, description: string) => void;
  onPin?: () => void;
  isPinned?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, description, onDelete, onSave, onPin, isPinned = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const handleSave = () => {
    if (onSave) {
      onSave(editTitle, editDescription);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setIsEditing(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className={`bg-[#FFEAD5] rounded-xl p-4 shadow-sm relative w-[314px]`}>
        <div className="absolute top-2 left-2 text-gray-400">
          <GripVertical size={16} />
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full font-semibold text-lg mb-2 border-none outline-none bg-transparent"
          placeholder="Title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-sm text-gray-700 leading-relaxed border-none outline-none bg-transparent resize-none"
          placeholder="Description"
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#FFEAD5] rounded-xl p-4 shadow-sm relative w-[314px] cursor-pointer" onClick={handleCardClick}>
      <div className="absolute top-2 left-2 text-gray-400">
        <GripVertical size={16} />
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        {onPin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className={`flex items-center justify-center ${isPinned ? 'text-[#09BF64]' : 'text-gray-600 hover:text-black'}`}
          >
            <Icon 
              icon="mynaui:pin" 
              width="16" 
              height="16" 
              style={{ color: isPinned ? '#09BF64' : '#4b5563' }} 
              className={isPinned ? 'text-[#09BF64]' : 'text-gray-600'} 
            />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-600 hover:text-black"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default NoteCard;