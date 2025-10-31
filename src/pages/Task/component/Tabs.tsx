import React, { useState, useEffect, useRef } from "react";
import Board from "../innerpage/Board";
import Training from "../innerpage/Training";
import TabButtons from "./TabButtons";
import TakeANote from "./TakeANote";
import NecessaryInformation from "../innerpage/NecessaryInformation";
import NoteCard from "./NoteCard";
import { useNavigate } from "react-router";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  backgroundColor: string;
}

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Board");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

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
    // Skip saving on initial mount to prevent infinite loop
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    localStorage.setItem("taskNotes", JSON.stringify(notes));
    // Dispatch event with flag to prevent reload in the same component instance
    window.dispatchEvent(new CustomEvent("notesUpdated", { detail: { skipReload: true } }));
  }, [notes]);

  useEffect(() => {
    const handleNotesUpdated = (e: CustomEvent) => {
      // Only load notes if the event didn't originate from this component
      if (!e.detail?.skipReload) {
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
      }
    };

    window.addEventListener("notesUpdated", handleNotesUpdated as EventListener);
    return () => {
      window.removeEventListener("notesUpdated", handleNotesUpdated as EventListener);
    };
  }, []);


  const renderContent = () => {
    switch (activeTab) {
      case "Board":
        return <Board />;
      case "Training":
        return <Training />;
      case "Necessary Information":
        return <NecessaryInformation />;
      default:
        return null;
    }
  };


  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 w-full">
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <TabButtons activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex flex-col sm:justify-end sm:flex-col items-end w-full sm:w-auto ">
            <TakeANote notes={notes} setNotes={setNotes} editingNote={editingNote} setEditingNote={setEditingNote} />
            <div className="flex">
              <button
              className="cursor-pointer text-[#5D5FEF] hover:text-[#4a4cd1] font-medium text-right bg-transparent border-none"
              onClick={() => navigate("/notes")}
            >
              View all notes
            </button>
            </div>
          </div>
        </div>

        {notes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Recent Notes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.slice(0, 3).map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title || "Untitled"}
                  description={note.content}
                  onSave={(newTitle, newDescription) => {
                    const updatedNotes = notes.map(n =>
                      n.id === note.id
                        ? { ...n, title: newTitle, content: newDescription }
                        : n
                    );
                    setNotes(updatedNotes);
                  }}
                  onDelete={() => setNotes(notes.filter(n => n.id !== note.id))}
                />
              ))}
            </div>
          </div>
        )}

        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Tabs;
