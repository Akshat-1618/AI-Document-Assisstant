import { useState } from "react";
import axios from "axios";

function LabPlanner() {

  const [file, setFile] = useState(null);
  const [plan, setPlan] = useState([]);

  const generatePlan = async () => {

    if (!file) {

      alert("Upload syllabus PDF");
      return;

    }

    const formData = new FormData();

    formData.append("syllabus", file);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/lab-planner-agent",
        formData
      );

      setPlan(res.data.lab_plan);

    } catch (err) {

      console.error(err);
      alert("Lab planner failed");

    }

  };

  return (

    <div style={{ color: "black" }}>

      <h2>Lab Planner</h2>

      <br/>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={generatePlan}>
        Generate Lab Plan
      </button>

      <br/><br/>

      {plan.length > 0 && (

        <table border="1" cellPadding="10">

          <thead>

            <tr>

              <th>Week</th>
              <th>Experiment</th>
              <th>Task</th>
              <th>Remark</th>

            </tr>

          </thead>

          <tbody>

            {plan.map((row, index) => (

              <tr key={index}>

                <td>{row.week}</td>
                <td>{row.experiment}</td>
                <td>{row.task}</td>
                <td>{row.remark}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default LabPlanner;