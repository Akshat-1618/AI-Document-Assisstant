import { useState } from "react";
import axios from "axios";
import MindMap from "./MindMap";
import ReactMarkdown from "react-markdown";

function Summary() {

  const [summaryText, setSummaryText] = useState("");
  const [summaryPoints, setSummaryPoints] = useState([]);

  const [viewMode, setViewMode] = useState("text");

  const [warning, setWarning] = useState("");

  const [loading, setLoading] = useState(false);


  const generateSummary = async () => {

    try {

      setLoading(true);

      // 🔴 CHECK DOCUMENT STATUS FIRST

      const status = await axios.get(
        "http://127.0.0.1:8000/document-status"
      );

      if (!status.data.uploaded) {

        setWarning("⚠ Upload PDF first to generate summary");

        setLoading(false);

        return;

      }

      // remove warning if PDF exists

      setWarning("");


      // ✅ GENERATE SUMMARY

      if (viewMode === "text") {

        const res = await axios.get(
          "http://127.0.0.1:8000/summary-text"
        );

        setSummaryText(res.data.summary);

      }

      else {

        const res = await axios.get(
          "http://127.0.0.1:8000/summary-visual"
        );

        setSummaryPoints(res.data.points);

      }

    }

    catch (error) {

      console.error(error);

      setWarning("Something went wrong while generating summary");

    }

    finally {

      setLoading(false);

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

          {/* TEXT SUMMARY RADIO */}

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
              style={{ accentColor: "#6d5aff" }}
            />

            Text Summary

          </label>


          {/* VISUAL SUMMARY RADIO */}

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
              style={{ accentColor: "#6d5aff" }}
            />

            Visual Summary

          </label>

        </div>


        {/* GENERATE BUTTON */}

        <br />

        <button
          onClick={generateSummary}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Generating summary..." : "Generate"}
        </button>


        {/* AI LOADING MESSAGE */}

        {loading && (

          <p
            style={{
              marginTop: "10px",
              color: "#6d5aff",
              fontWeight: "500"
            }}
          >

            🤖 AI is preparing your summary...

          </p>

        )}


        {/* WARNING MESSAGE */}

        {warning && (

          <p
            style={{
              marginTop: "12px",
              color: "#dc2626",
              fontWeight: "500"
            }}
          >

            {warning}

          </p>

        )}

      </div>


      {/* SUMMARY OUTPUT */}

      <div style={{ marginTop: "20px" }}>


        {/* TEXT SUMMARY */}

        {viewMode === "text" && summaryText && (

          <div>

            <ReactMarkdown
              components={{

                p: ({ children }) => {

                  const text = children?.[0];

                  const isHeading =
                    typeof text === "string" &&
                    text === text.toUpperCase() &&
                    text.length < 80;

                  return (

                    <p
                      style={{
                        fontWeight: isHeading ? "600" : "400",
                        fontSize: isHeading ? "18px" : "15px",
                        marginTop: isHeading ? "22px" : "10px",
                        marginBottom: "8px"
                      }}
                    >

                      {children}

                    </p>

                  );

                }

              }}
            >

              {summaryText}

            </ReactMarkdown>

          </div>

        )}


        {/* VISUAL SUMMARY */}

        {viewMode === "visual" && summaryPoints.length > 0 && (

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