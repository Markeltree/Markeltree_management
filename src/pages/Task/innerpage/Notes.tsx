import React, { useState, useEffect, useRef } from "react";
import HeadingTwo from "../component/HeadingTwo";
import NoteCard from "../component/NoteCard";
import Export from "../component/Export";
import { IoFilterOutline } from "react-icons/io5";
import FilterModal from "../component/FilterModal";
import SearchInput from "../component/SearchInput";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useLocation, useNavigate } from "react-router";
import { Icon } from "@iconify/react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  backgroundColor: string;
  pinned?: boolean;
}

const Notes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editNote = location.state?.editNote as Note | undefined;
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const lastEditNoteIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem("taskNotes");
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).map(
          (note: Omit<Note, "createdAt"> & { createdAt: string }) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            pinned: note.pinned || false,
          })
        );
        setNotes(parsedNotes);
      }
    };

    loadNotes();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "taskNotes") {
        loadNotes();
      }
    };

    const handleNotesUpdated = (e: CustomEvent) => {
      if (!e.detail?.skipReload) {
        loadNotes();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("notesUpdated", handleNotesUpdated as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("notesUpdated", handleNotesUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    if (editNote && editNote.id !== lastEditNoteIdRef.current) {
      lastEditNoteIdRef.current = editNote.id;
      setEditingNote(editNote);
      setTitle(editNote.title);
      setContent(editNote.content);
      setIsExpanding(true);
      setTimeout(() => {
        setIsExpanded(true);
        setTimeout(() => {
          setIsExpanding(false);
        }, 300);
      }, 300);
    }
  }, [editNote]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    localStorage.setItem("taskNotes", JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent("notesUpdated", { detail: { skipReload: true } }));
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

  const handleExpand = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setIsExpanded(true);
      setTimeout(() => {
        setIsExpanding(false);
      }, 300);
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      setTitle("");
      setContent("");
      if (editingNote) setEditingNote(null);
    }, 300);
  };

  const handleAddNote = () => {
    if (title.trim() || content.trim()) {
      if (editingNote) {
        const updatedNotes = notes.map((note) =>
          note.id === editingNote.id
            ? { ...note, title: title.trim(), content: content.trim() }
            : note
        );
        setNotes(updatedNotes);
        setEditingNote(null);
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date(),
          backgroundColor: "#FFEAD5",
          pinned: false,
        };
        setNotes([newNote, ...notes]);
      }
      handleClose();
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
        isExpanded &&
        !isClosing
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isClosing]);

  return (
    <>
    <div className="p-4 sm:p-6 bg-white dark:bg-[#0D0D0D] min-h-screen z-50">
        <div className="grid grid-cols-3 lg:grid-cols-3 max-sm:grid-cols-1 items-center gap-3">
          <div className="flex items-center gap-3">
            <h1
              className="text-[#09BF64] text-[14px] flex flex-row items-center gap-1 cursor-pointer hover:underline"
              onClick={() => navigate(-1)}
            >
              <Icon icon="ion:arrow-back-outline" width="18" height="18" />
              {/* Back */}
            </h1>
            <HeadingTwo
              text="My Notes"
              className="text-[#333333] dark:text-white"
            />
          </div>
          <div className="flex flex-row justify-between sm:flex-row sm:items-center gap-3 max-sm:flex-col">
            <div ref={containerRef} className="w-full max-w-2xl mx-auto">
              {!isExpanded ? (
                <div
                  onClick={handleExpand}
                  className="w-full p-2 sm:p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-text hover:shadow-md transition-all duration-300 dark:bg-gray-800 bg-white"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-[16px]">
                    Take a note...
                  </p>
                </div>
              ) : (
                <div 
                  className="dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 sm:p-4"
                  style={{
                    animation: isExpanding 
                      ? 'expandNote 0.3s ease-out forwards' 
                      : isClosing 
                      ? 'collapseNote 0.3s ease-in forwards' 
                      : 'none'
                  }}
                >
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
                      className="px-4 sm:px-6 py-2 bg-[#09BF64] text-white rounded-lg hover:bg-[#4a4cd1] transition-colors duration-200 font-medium text-sm sm:text-base"
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
          <div className="flex flex-row">
            <SearchInput />
            <Export
              BtnName="Filters"
              icon={IoFilterOutline}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>

        <div className="mt-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            {(() => {
              const pinnedNotes = notes.filter(note => note.pinned);
              const recentNotes = notes.filter(note => !note.pinned);
              
              return (
                <>
                  {pinnedNotes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-medium mb-4">Pinned Notes</h4>
                      <Droppable droppableId="pinned-notes" direction="horizontal">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                          >
                            {pinnedNotes
                              .sort(
                                (a, b) =>
                                  new Date(b.createdAt).getTime() -
                                  new Date(a.createdAt).getTime()
                              )
                              .map((note, index) => (
                                <Draggable
                                  key={note.id}
                                  draggableId={note.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <NoteCard
                                        title={note.title || "Untitled"}
                                        description={note.content}
                                        isPinned={note.pinned || false}
                                        onPin={() => {
                                          const updatedNotes = notes.map((n) =>
                                            n.id === note.id ? { ...n, pinned: !n.pinned } : n
                                          );
                                          setNotes(updatedNotes);
                                        }}
                                        onSave={(newTitle, newDescription) => {
                                          const updatedNotes = notes.map((n) =>
                                            n.id === note.id
                                              ? {
                                                  ...n,
                                                  title: newTitle,
                                                  content: newDescription,
                                                }
                                              : n
                                          );
                                          setNotes(updatedNotes);
                                        }}
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
                    </div>
                  )}
                  
                  {recentNotes.length > 0 && (
                    <div>
                      <h4 className="text-base font-medium mb-4">Recent Notes</h4>
                      <Droppable droppableId="recent-notes" direction="horizontal">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                          >
                            {recentNotes
                              .sort(
                                (a, b) =>
                                  new Date(b.createdAt).getTime() -
                                  new Date(a.createdAt).getTime()
                              )
                              .map((note, index) => (
                                <Draggable
                                  key={note.id}
                                  draggableId={note.id}
                                  index={pinnedNotes.length + index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <NoteCard
                                        title={note.title || "Untitled"}
                                        description={note.content}
                                        isPinned={note.pinned || false}
                                        onPin={() => {
                                          const updatedNotes = notes.map((n) =>
                                            n.id === note.id ? { ...n, pinned: !n.pinned } : n
                                          );
                                          setNotes(updatedNotes);
                                        }}
                                        onSave={(newTitle, newDescription) => {
                                          const updatedNotes = notes.map((n) =>
                                            n.id === note.id
                                              ? {
                                                  ...n,
                                                  title: newTitle,
                                                  content: newDescription,
                                                }
                                              : n
                                          );
                                          setNotes(updatedNotes);
                                        }}
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
                    </div>
                  )}
                </>
              );
            })()}
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
