import { useState } from "react";
import axios from "axios";

function Planner() {

  const [files, setFiles] = useState([]);
  const [days, setDays] = useState("");
  const [plan, setPlan] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {

    if (files.length === 0 || !days) {
      alert("Upload PDFs and enter number of study days");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("days", days);

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/planner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setPlan(res.data.plan);
      setSteps(res.data.agent_steps);

    } catch (error) {

      console.error(error);
      alert("Planner generation failed");

    } finally {

      setLoading(false);

    }
  };


  return (

    <div style={{ color: "black" }}>

      <h2 style={{ marginBottom: "15px" }}>
        📅 AI Study Planner (Agentic Mode)
      </h2>


      {/* FILE UPLOAD */}

      <div style={{ marginBottom: "20px" }}>

        <label style={{ fontWeight: "600" }}>
          Upload Study Material (Syllabus / Notes / PYQs):
        </label>

        <br /><br />

        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        {/* SHOW FILE NAMES */}

        {files.length > 0 && (

          <ul style={{ marginTop: "10px" }}>

            {[...files].map((file, index) => (

              <li key={index}>
                📄 {file.name}
              </li>

            ))}

          </ul>

        )}

      </div>


      {/* DAYS INPUT */}

      <div style={{ marginBottom: "20px" }}>

        <label style={{ fontWeight: "600" }}>
          Number of days available:
        </label>

        <br /><br />

        <input
          type="number"
          placeholder="Example: 5"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "200px"
          }}
        />

      </div>


      {/* BUTTON */}

      <button
        onClick={generatePlan}
        disabled={loading}
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          background: loading ? "#aaa" : "#6d5aff",
          color: "white",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >

        {loading ? "Generating Plan..." : "Generate Smart Study Plan"}

      </button>


      <br /><br />


      {/* AGENT THINKING STEPS */}

      {steps.length > 0 && (

        <div
          style={{
            background: "#eef2ff",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "30px",
            borderLeft: "5px solid #6d5aff"
          }}
        >

          <strong>🤖 Agent Thinking Process</strong>

          <ul style={{ marginTop: "12px", lineHeight: "1.8" }}>

            {steps.map((step, index) => (

              <li key={index}>
                {step}
              </li>

            ))}

          </ul>

        </div>

      )}


      {/* OUTPUT TABLE */}

      {plan.length > 0 && (

        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #ddd"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white"
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#6d5aff",
                  color: "white"
                }}
              >

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left"
                  }}
                >
                  Day
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "left"
                  }}
                >
                  Topics to Study
                </th>

              </tr>

            </thead>


            <tbody>

              {plan.map((row, index) => (

                <tr
                  key={index}
                  style={{
                    background:
                      index % 2 === 0 ? "#fafafa" : "white"
                  }}
                >

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #eee",
                      fontWeight: "600"
                    }}
                  >
                    {row.day}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #eee"
                    }}
                  >
                    {row.topics}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default Planner;