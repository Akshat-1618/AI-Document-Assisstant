import { useState } from "react";

import axios from "axios";


function LabPlanner() {

  const [file, setFile] = useState(null);

  const [plan, setPlan] = useState([]);

  const [loading, setLoading] = useState(false);


  // -----------------------------------
  // Generate Plan
  // -----------------------------------

  const generatePlan = async () => {

    if (!file) {

      alert("Upload syllabus PDF");

      return;

    }

    const formData = new FormData();

    formData.append("syllabus", file);

    try {

      setLoading(true);

      const res = await axios.post(

        "http://127.0.0.1:8000/lab-planner-agent",

        formData

      );

      setPlan(res.data.lab_plan);

    } catch (err) {

      console.error(err);

      alert("Lab planner failed");

    } finally {

      setLoading(false);

    }

  };


  // -----------------------------------
  // Download CSV
  // -----------------------------------

  const downloadCSV = () => {

    if (plan.length === 0) {

      alert("No lab plan available");

      return;

    }

    const headers = [

      "Week",
      "Date",
      "Topic",
      "Task",
      "Comment"

    ];

    const rows = plan.map((row) => [

      row.week,

      row.date_range,

      row.topic,

      row.task,

      row.comment

    ]);

    let csvContent =

      headers.join(",") + "\n";

    rows.forEach((row) => {

      const formattedRow = row.map((item) =>

        `"${item || ""}"`

      );

      csvContent +=

        formattedRow.join(",") + "\n";

    });

    const blob = new Blob(

      [csvContent],

      { type: "text/csv;charset=utf-8;" }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(

      "download",

      "lab_planner.csv"

    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };


  return (

    <div
      style={{

        minHeight: "100vh",

        background: "#f5f7fb",

        padding: "40px",

        fontFamily: "Poppins, sans-serif"

      }}
    >

      {/* ---------------- HEADER ---------------- */}

      <div
        style={{

          background: "white",

          padding: "30px",

          borderRadius: "20px",

          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",

          marginBottom: "30px"

        }}
      >

        <h1
          style={{

            margin: 0,

            color: "#4f46e5",

            fontSize: "38px",

            fontWeight: "700"

          }}
        >
          Lab Planner
        </h1>

        <p
          style={{

            color: "#666",

            marginTop: "10px",

            fontSize: "16px"

          }}
        >
          Generate beautiful week-wise lab schedules
        </p>


        {/* ---------------- FILE INPUT ---------------- */}

        <div
          style={{

            marginTop: "30px",

            display: "flex",

            gap: "15px",

            alignItems: "center",

            flexWrap: "wrap"

          }}
        >

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{

              padding: "12px",

              border: "2px dashed #c7d2fe",

              borderRadius: "12px",

              background: "#eef2ff",

              width: "320px"

            }}
          />

          {/* Generate Button */}

          <button
            onClick={generatePlan}
            disabled={loading}
            style={{

              background: "#4f46e5",

              color: "white",

              border: "none",

              padding: "14px 28px",

              borderRadius: "12px",

              cursor: "pointer",

              fontSize: "16px",

              fontWeight: "600"

            }}
          >

            {

              loading
              ? "Generating..."
              : "Generate Lab Plan"

            }

          </button>


          {/* Download Button */}

          {

            plan.length > 0 && (

              <button
                onClick={downloadCSV}
                style={{

                  background: "#16a34a",

                  color: "white",

                  border: "none",

                  padding: "14px 28px",

                  borderRadius: "12px",

                  cursor: "pointer",

                  fontSize: "16px",

                  fontWeight: "600"

                }}
              >

                Download CSV

              </button>

            )

          }

        </div>

      </div>


      {/* ---------------- TABLE ---------------- */}

      {

        plan.length > 0 && (

          <div
            style={{

              background: "white",

              borderRadius: "20px",

              overflowX: "auto",

              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",

              padding: "20px"

            }}
          >

            <table
              style={{

                width: "100%",

                borderCollapse: "collapse",

                minWidth: "1100px"

              }}
            >

              <thead>

                <tr
                  style={{

                    background: "#4f46e5",

                    color: "white"

                  }}
                >

                  <th style={thStyle}>Week</th>

                  <th style={thStyle}>Date</th>

                  <th style={thStyle}>Topic</th>

                  <th style={thStyle}>Task</th>

                  <th style={thStyle}>Comment</th>

                </tr>

              </thead>

              <tbody>

                {

                  plan.map((row, index) => (

                    <tr
                      key={index}
                      style={{

                        background:

                          index % 2 === 0
                          ? "#f9fafb"
                          : "white"

                      }}
                    >

                      <td style={tdStyle}>
                        {row.week}
                      </td>

                      <td style={tdStyle}>
                        {row.date_range}
                      </td>

                      <td
                        style={{

                          ...tdStyle,

                          minWidth: "420px",

                          lineHeight: "1.6"

                        }}
                      >
                        {row.topic}
                      </td>

                      <td style={tdStyle}>

                        {

                          row.task && (

                            <span
                              style={{

                                background:

                                  row.task.includes("Evaluation")
                                  ? "#fef3c7"

                                  : row.task.includes("Test")
                                  ? "#fee2e2"

                                  : "#dcfce7",

                                color:

                                  row.task.includes("Evaluation")
                                  ? "#92400e"

                                  : row.task.includes("Test")
                                  ? "#991b1b"

                                  : "#166534",

                                padding: "8px 14px",

                                borderRadius: "999px",

                                fontSize: "14px",

                                fontWeight: "600"

                              }}
                            >

                              {row.task}

                            </span>

                          )

                        }

                      </td>

                      <td
                        style={{

                          ...tdStyle,

                          color: "#dc2626",

                          fontWeight: "500"

                        }}
                      >
                        {row.comment}
                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>

          </div>

        )

      }

    </div>

  );

}


/* ---------------- STYLES ---------------- */

const thStyle = {

  padding: "16px",

  textAlign: "left",

  fontSize: "15px",

  fontWeight: "600"

};


const tdStyle = {

  padding: "16px",

  borderBottom: "1px solid #e5e7eb",

  verticalAlign: "top",

  fontSize: "15px",

  color: "#111827"

};


export default LabPlanner;