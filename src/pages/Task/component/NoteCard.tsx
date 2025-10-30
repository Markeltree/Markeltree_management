import React from "react";
import { Trash2, GripVertical } from "lucide-react";

interface NoteCardProps {
  title: string;
  description: string;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, description, onDelete }) => {
  return (
    <div className="bg-[#FFF9F0] rounded-xl p-4 shadow-sm relative w-[314px] cursor-move">
      <div className="absolute top-2 left-2 text-gray-400">
        <GripVertical size={16} />
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        <Trash2 size={16} />
      </button>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default NoteCard;