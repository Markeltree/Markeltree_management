import React, { useState, useRef, useCallback } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  backgroundColor: string;
  pinned?: boolean;
}

const noteColors = [
  '#FFEAD5',
];

interface TakeANoteProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  editingNote?: Note | null;
  setEditingNote?: React.Dispatch<React.SetStateAction<Note | null>>;
}

const TakeANote: React.FC<TakeANoteProps> = ({ notes, setNotes, editingNote, setEditingNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      if (setEditingNote) setEditingNote(null);
      setTitle('');
      setContent('');
    }, 300);
  }, [setEditingNote]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isExpanded && !isClosing) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isClosing, handleClose]);

  React.useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setIsExpanding(true);
      setTimeout(() => {
        setIsExpanded(true);
        setTimeout(() => {
          setIsExpanding(false);
        }, 300);
      }, 300);
    }
  }, [editingNote]);

  const handleExpand = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setIsExpanded(true);
      setTimeout(() => {
        setIsExpanding(false);
      }, 300);
    }, 300);
  };


  const handleAddNote = () => {
    if (title.trim() || content.trim()) {
      if (editingNote) {
        const updatedNotes = notes.map(note =>
          note.id === editingNote.id
            ? { ...note, title: title.trim(), content: content.trim() }
            : note
        );
        setNotes(updatedNotes);
        if (setEditingNote) setEditingNote(null);
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date(),
          backgroundColor: noteColors[Math.floor(Math.random() * noteColors.length)],
          pinned: false,
        };
        setNotes([newNote, ...notes]);
      }
      setTitle('');
      setContent('');
      handleClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };


  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        {!isExpanded ? (
          <div 
            onClick={handleExpand}
            className="w-[300px] p-2 border border-gray-300 rounded-lg cursor-text hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-600 opacity-100 scale-100"
          >
            <p className="text-gray-500 dark:text-gray-400 text-[16px]">Take a note...</p>
          </div>
        ) : (
          <div 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2"
            style={{
              animation: isExpanding 
                ? 'expandNote 0.3s ease-out forwards' 
                : isClosing 
                ? 'collapseNote 0.3s ease-in forwards' 
                : 'none'
            }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-2 p-2 text-lg font-medium border-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500"
              autoFocus
            />
            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border-none outline-none bg-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
              rows={3}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddNote}
                className="px-6 py-2 bg-[#0088D1] text-white rounded-lg hover:bg-[#4a4cd1] transition-colors duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes expandNote {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes collapseNote {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default TakeANote;
