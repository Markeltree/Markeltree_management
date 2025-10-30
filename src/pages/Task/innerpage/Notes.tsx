import React, { useState, useEffect, useRef } from "react";
import HeadingTwo from "../component/HeadingTwo";
import NoteCard from "../component/NoteCard";
import Export from "../component/Export";
import { IoFilterOutline } from "react-icons/io5";
import FilterModal from "../component/FilterModal";
import SearchInput from "../component/SearchInput";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  backgroundColor: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("taskNotes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map(
        (note: Omit<Note, "createdAt"> & { createdAt: string }) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        })
      );
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskNotes", JSON.stringify(notes));
  }, [notes]);

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
  };

  const handleAddNote = () => {
    if (title.trim() || content.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date(),
        backgroundColor: "#FFF9F0",
      };
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <>
      <div className="p-4 sm:p-6 bg-white dark:bg-[#0D0D0D] min-h-screen">
        <div className="grid grid-cols-4 md:grid-cols-2 max-sm:grid-cols-1 justify-between items-center gap-3">
          <div className="">
            <HeadingTwo text="My Notes" className="text-[#333333] dark:text-white" />
          </div>
          <div className="flex flex-row justify-between sm:flex-row sm:items-center gap-3 max-sm:flex-col">
            {/* Take a Note Input */}
            <div
              ref={containerRef}
              className="w-full max-w-2xl mx-auto"
            >
              {!isExpanded ? (
                <div
                  onClick={() => setIsExpanded(true)}
                  className="w-full p-2 sm:p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-text hover:shadow-md transition-shadow duration-20 dark:bg-gray-800"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-[16px]">Take a note...</p>
                </div>
              ) : (
                <div className="dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 sm:p-4 transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-2 p-2 text-base sm:text-lg font-medium border-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <textarea
                    placeholder="Take a note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-2 border-none outline-none bg-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                    rows={3}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddNote}
                      className="px-4 sm:px-6 py-2 bg-[#5D5FEF] text-white rounded-lg hover:bg-[#4a4cd1] transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
            <div>
              <SearchInput />
            </div>
            <div>
              <Export
                BtnName="Filters"
                icon={IoFilterOutline}
                onClick={() => setIsFilterModalOpen(true)}
              />
            </div>
          </div>

        <div className="mt-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                >
                  {notes.map((note, index) => (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <NoteCard
                            title={note.title || "Untitled"}
                            description={note.content}
                            onDelete={() => handleDeleteNote(note.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default Notes;
