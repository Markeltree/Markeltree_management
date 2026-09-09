import { createContext, useContext, useState } from "react";

const PinContext = createContext();

export function PinProvider({ children }) {
  const [pins, setPins] = useState([]);

  // Add pin (only once)
  const addPin = (id, meta) => {
    setPins((prev) => {
      if (prev.find((p) => p.id === id)) return prev;
      return [...prev, { id, ...meta }];
    });
  };

  // Remove single pin by id
  const removePin = (id) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear all pins
  const clearPins = () => {
    setPins([]);
  };

  return (
    <PinContext.Provider value={{ pins, addPin, removePin, clearPins }}>
      {children}
    </PinContext.Provider>
  );
}

export const usePins = () => useContext(PinContext);
