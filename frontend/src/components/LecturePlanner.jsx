import { useState } from "react";
import axios from "axios";

function LecturePlanner() {
  const [file, setFile] = useState(null);
  const [days, setDays] = useState([]);
  const [plan, setPlan] = useState([]);
  const [summary, setSummary] = useState("");

  const handleCheckbox = (day) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const generatePlan = async () => {
    if (!file || days.length === 0) {
      alert("Upload file and select lecture days");
      return;
    }

    const formData = new FormData();
    formData.append("syllabus", file);
    formData.append("lecture_days", days.join(","));

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/lecture-planner-agent",
        formData
      );

      setPlan(res.data.lecture_plan || []);
      setSummary(res.data.message || "");
    } catch (err) {
      console.error(err);
      alert("Lecture planner failed");
    }
  };

  // ✅ CSV DOWNLOAD FUNCTION
  const downloadCSV = () => {
    if (!plan || plan.length === 0) {
      alert("No data to download");
      return;
    }

    const headers = ["Week", "Date Range", "Topic", "Holidays", "Classes"];

    const rows = plan.map((row) => [
      row.week,
      row.date_range,
      (row.topic || "").replace(/<br>/g, " | "),
      row.holidays,
      row.classes,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((x) => `"${x}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lecture_plan.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        background: "#f4f6fb",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📚 Lecture Planner</h2>

        {/* Upload */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        {/* Days */}
        <b>Select Lecture Days:</b>
        <br />

        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => (
          <label key={day} style={{ marginRight: "12px" }}>
            <input
              type="checkbox"
              checked={days.includes(day)}
              onChange={() => handleCheckbox(day)}
            />{" "}
            {day}
          </label>
        ))}

        <br />
        <br />

        {/* Buttons */}
        <button
          onClick={generatePlan}
          style={{
            background: "#4f46e5",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Generate Lecture Plan
        </button>

        <button
          onClick={downloadCSV}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Download CSV
        </button>

        <br />
        <br />

        {/* Summary */}
        {summary && (
          <div
            style={{
              background: "#eef2ff",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <b>{summary}</b>
          </div>
        )}

        {/* Table */}
        {plan.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead
                style={{
                  background: "#4f46e5",
                  color: "white",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  <th style={{ padding: "10px" }}>Week</th>
                  <th>Date Range</th>
                  <th>Topic</th>
                  <th>Holidays</th>
                  <th>Classes</th>
                </tr>
              </thead>

              <tbody>
                {plan.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        row.classes === 0 ? "#ffe6e6" : "#ffffff",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{row.week}</td>
                    <td>{row.date_range}</td>

                    <td
                      dangerouslySetInnerHTML={{
                        __html: row.topic || "",
                      }}
                      style={{
                        lineHeight: "1.6",
                        whiteSpace: "pre-line",
                      }}
                    ></td>

                    <td>{row.holidays}</td>
                    <td>{row.classes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturePlanner;