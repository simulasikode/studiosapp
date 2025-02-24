import { useState, useEffect } from "react";

function VersionDisplay() {
  const [version, setVersion] = useState("Loading...");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const response = await fetch("/version.js");
        const text = await response.text();
        const match = text.match(/version = '([^']+)'/);
        if (match && match[1]) {
          setVersion(match[1]);
        } else {
          setVersion("Version not found");
        }
      } catch (error) {
        console.error("Error fetching version:", error);
        setVersion("Unknown");
      }
    }

    fetchVersion();
  }, []);

  return <div>Version: {version}</div>;
}

export default VersionDisplay;
