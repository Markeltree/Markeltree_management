import React, { useState, useRef } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  backgroundColor: string;
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
        if (setEditingNote) setEditingNote(null);
        setTitle('');
        setContent('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, setEditingNote]);

  React.useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setIsExpanded(true);
    }
  }, [editingNote]);

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
        };
        setNotes([newNote, ...notes]);
      }
      setTitle('');
      setContent('');
      setIsExpanded(false);

      const currentNotes = editingNote
        ? notes.map(note =>
            note.id === editingNote.id
              ? { ...note, title: title.trim(), content: content.trim() }
              : note
          )
        : [{
            id: Date.now().toString(),
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date(),
            backgroundColor: noteColors[Math.floor(Math.random() * noteColors.length)],
          }, ...notes];

      localStorage.setItem("taskNotes", JSON.stringify(currentNotes));
      // Dispatch event to notify all components
      window.dispatchEvent(new CustomEvent("notesUpdated"));
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
            onClick={() => setIsExpanded(true)}
            className="w-[300px] p-2 border border-gray-300 rounded-lg cursor-text hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <p className="text-gray-500 dark:text-gray-400 text-[16px]">Take a note...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 transition-all duration-200">
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
                className="px-6 py-2 bg-[#5D5FEF] text-white rounded-lg hover:bg-[#4a4cd1] transition-colors duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default TakeANote;
