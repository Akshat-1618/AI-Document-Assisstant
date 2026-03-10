import { useState } from "react";
import axios from "axios";
import MindMap from "./MindMap";

function Summary() {
  const [summary, setSummary] = useState("");
  const [viewMode, setViewMode] = useState("text");

  const generateSummary = async () => {
    try {
      if (viewMode === "text") {
        const res = await axios.get("http://127.0.0.1:8000/summary-text");

        setSummary(res.data.summary);
      } else {
        const res = await axios.get("http://127.0.0.1:8000/summary-visual");

        setSummary(res.data.summary);
      }
    } catch (error) {
      console.error(error);
      alert("Error generating summary");
    }
  };

  return (
    <div>
      <h2>Document Summary</h2>

      <button onClick={generateSummary}>Generate Summary</button>

      <br />
      <br />

      <div>
        <strong>View Mode:</strong>

        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="viewMode"
            value="text"
            checked={viewMode === "text"}
            onChange={() => setViewMode("text")}
          />
          Text Summary
        </label>

        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="viewMode"
            value="visual"
            checked={viewMode === "visual"}
            onChange={() => setViewMode("visual")}
          />
          Visual Summary
        </label>
      </div>

      <br />

      {viewMode === "text" && (
        <div>
          <p>{summary}</p>
        </div>
      )}

      {viewMode === "visual" && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            background: "#f9f9f9",
            width: "100%",
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MindMap summary={summary} />
        </div>
      )}
    </div>
  );
}

export default Summary;
