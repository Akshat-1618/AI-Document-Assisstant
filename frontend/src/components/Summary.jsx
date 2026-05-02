import { useState } from "react";
import axios from "axios";
import MindMap from "./MindMap";

function Summary() {

  const [summaryText, setSummaryText] = useState("");
  const [summaryPoints, setSummaryPoints] = useState([]);
  const [viewMode, setViewMode] = useState("text");


  const generateSummary = async () => {

    try {

      if (viewMode === "text") {

        const res = await axios.get(
          "http://127.0.0.1:8000/summary-text"
        );

        setSummaryText(res.data.summary);

      } else {

        const res = await axios.get(
          "http://127.0.0.1:8000/summary-visual"
        );

        setSummaryPoints(res.data.points);

      }

    } catch (error) {

      console.error(error);
      alert("Error generating summary");

    }

  };


  return (

    <div>

      <h2>Document Summary</h2>


      


      {/* VIEW MODE RADIO BUTTONS */}

      <div style={{ marginTop: "20px" }}>

        <strong>View Mode:</strong>

        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
            marginTop: "10px"
          }}
        >

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >

            <input
              type="radio"
              name="viewMode"
              value="text"
              checked={viewMode === "text"}
              onChange={() => setViewMode("text")}
              style={{
                accentColor: "#6d5aff"
              }}
            />

            Text Summary

          </label>


          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap"
              
            }}
          >

            <input
              type="radio"
              name="viewMode"
              value="visual"
              checked={viewMode === "visual"}
              onChange={() => setViewMode("visual")}
              style={{
                accentColor: "#6d5aff"
              }}
            />

            Visual Summary

          </label>

        </div>

        <br></br>
      {/* Generate Button */}
      <button onClick={generateSummary}>
        Generate
      </button>
      </div>


      {/* SUMMARY OUTPUT */}

      <div style={{ marginTop: "20px" }}>

        {viewMode === "text" && (

          <div>
            <p>{summaryText}</p>
          </div>

        )}


        {viewMode === "visual" && (

          <div
            style={{
              border: "1px solid #ddd6fe",
              padding: "20px",
              borderRadius: "12px",
              background: "#fafaff",
              width: "100%",
              height: "520px"
            }}
          >

            <MindMap points={summaryPoints} />

          </div>

        )}

      </div>

    </div>

  );

}

export default Summary;