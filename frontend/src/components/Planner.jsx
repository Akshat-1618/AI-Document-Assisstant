import { useState } from "react";
import axios from "axios";

function Planner() {

  const [files, setFiles] = useState([]);
  const [days, setDays] = useState("");
  const [plan, setPlan] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

    <div
      style={{
        maxWidth: "1100px",
        width: "90%",
        margin: "40px auto",
        background: "white",
        padding: "48px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,.08)"
      }}
    >

      {/* TITLE */}

      <h2
        style={{
          fontSize: "46px",
          color: "#4f46e5",
          marginBottom: "8px"
        }}
      >
        Study Planner
      </h2>


      <p
        style={{
          color: "#6b7280",
          marginBottom: "30px"
        }}
      >
        Upload syllabus / notes / PYQs and generate a smart study schedule
      </p>


      {/* FILE UPLOAD */}

      <label style={{ fontWeight: "600" }}>
        Upload Study Material
      </label>


      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(e) => {

setUploading(true);

setTimeout(() => {

setFiles(e.target.files);
setUploading(false);

}, 700);

}}
        style={{
          marginTop: "12px",
          marginBottom: "18px",
          padding: "14px",
          borderRadius: "12px",
          border: "2px dashed #c7d2fe",
          width: "100%",
          background: "#f8faff"
        }}
      />


      {/* FILE LIST */}

     {/* Uploading indicator */}

{uploading && (

<p
style={{
marginTop: "10px",
color: "#6d5aff",
fontWeight: "600"
}}
>
Uploading files...
</p>

)}


{/* Uploaded files list */}

{!uploading && files.length > 0 && (

<ul style={{ marginTop: "12px" }}>

{[...files].map((file, index) => (

<li
key={index}
style={{
color: "#16a34a",
fontWeight: "600",
listStyle: "none",
paddingLeft: "0"
}}
>
✔ {file.name}
</li>

))}

</ul>

)}


      {/* DAYS INPUT */}

      <label style={{ fontWeight: "600" }}>
        Number of days available
      </label>


      <input
        type="number"
        placeholder="Example: 5"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        style={{
          marginTop: "12px",
          marginBottom: "28px",
          marginLeft:"12px",
          marginRight:"12px",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          width: "220px",
          background: "#f9fafb"
        }}
      />


      {/* BUTTON */}

      <button
        onClick={generatePlan}
        disabled={loading}
        style={{
          padding: "16px 28px",
          
          borderRadius: "14px",
          border: "none",
          background: loading
            ? "#a5b4fc"
            : "linear-gradient(135deg,#6d5aff,#8b77ff)",
          color: "white",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >

        {loading
          ? "Generating Plan..."
          : "Generate Smart Study Plan"}

      </button>


      {/* OUTPUT TABLE */}

      {plan.length > 0 && (

        <div
          style={{
            marginTop: "40px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #e5e7eb"
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
                  background:
                    "linear-gradient(135deg,#6d5aff,#8b77ff)",
                  color: "white"
                }}
              >

                <th style={{ padding: "14px" }}>
                  Day
                </th>

                <th style={{ padding: "14px" }}>
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
                      index % 2 === 0
                        ? "#fafafa"
                        : "white"
                  }}
                >

                  <td
                    style={{
                      padding: "14px",
                      borderTop: "1px solid #eee",
                      fontWeight: "600"
                    }}
                  >
                    {row.day}
                  </td>

                  <td
                    style={{
                      padding: "14px",
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