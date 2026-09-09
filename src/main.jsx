import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import { PinProvider } from "./context/PinContext";
import "./index.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ModalProvider>
        <PinProvider>
          <App />
        </PinProvider>
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>
);
