import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./styles/globals.css";
import "./styles/desktop.css";
import "./styles/workbench-theme.css";

const root = document.getElementById("root");
if (root) {
  try {
    createRoot(root).render(<App />);
  } catch (err) {
    root.textContent = String(err);
  }
}

