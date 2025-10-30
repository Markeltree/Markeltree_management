import React, { useState, useEffect } from "react";
import Board from "../innerpage/Board";
import Training from "../innerpage/Training";
import TabButtons from "./TabButtons";
import TakeANote from "./TakeANote";
import NecessaryInformation from "../innerpage/NecessaryInformation";
import { Navigate, useNavigate } from "react-router";

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
  const navigate = useNavigate();

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
          <div className="flex flex-col sm:justify-end sm:flex-col items-center w-full sm:w-auto ">
            <TakeANote notes={notes} setNotes={setNotes} />
            <span
              className="cursor-pointer text-[#5D5FEF] hover:text-[#4a4cd1] font-medium"
              onClick={() => navigate("/notes")}
            >
              View all notes
            </span>
          </div>
        </div>

        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Tabs;
