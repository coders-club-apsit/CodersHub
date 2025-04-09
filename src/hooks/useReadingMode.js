import { useState, useEffect } from "react";

const READING_MODE_KEY = "reading_mode"; // full or compact

const useReadingMode = () => {
  const [mode, setMode] = useState("compact"); // default to compact

  useEffect(() => {
    const stored = localStorage.getItem(READING_MODE_KEY);
    if (stored === "full" || stored === "compact") {
      setMode(stored);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === "compact" ? "full" : "compact";
    setMode(newMode);
    localStorage.setItem(READING_MODE_KEY, newMode);
  };

  return { mode, toggleMode };
};

export default useReadingMode;
