import { useState } from "react";
import axios from "axios";

function LecturePlanner() {

  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState([]);
  const [plan, setPlan] = useState([]);

  const handleCheckbox = (day) => {

    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }

  };

  const generatePlan = async () => {

    if (!file || !startDate || !endDate || days.length === 0) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("syllabus", file);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("lecture_days", days.join(","));

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/lecture-planner-agent",
        formData
      );

      setPlan(res.data.lecture_plan);

    } catch (err) {

      console.error(err);
      alert("Lecture planner failed");

    }

  };

  return (

    <div style={{ color: "black" }}>

      <h2>Lecture Planner</h2>

      <br/>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br/><br/>

      Start Date:

      <input
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
      />

      <br/><br/>

      End Date:

      <input
        type="date"
        onChange={(e) => setEndDate(e.target.value)}
      />

      <br/><br/>

      Lecture Days:

      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => (

        <label key={day} style={{ marginRight: "10px" }}>

          <input
            type="checkbox"
            onChange={() => handleCheckbox(day)}
          />

          {day}

        </label>

      ))}

      <br/><br/>

      <button onClick={generatePlan}>
        Generate Lecture Plan
      </button>

      <br/><br/>

      {plan.length > 0 && (

        <table border="1" cellPadding="10">

          <thead>

            <tr>

              <th>Date</th>
              <th>Lecture No</th>
              <th>Topic</th>

            </tr>

          </thead>

          <tbody>

            {plan.map((row, index) => (

              <tr key={index}>

                <td>{row.date}</td>
                <td>{row.lecture_no}</td>
                <td>{row.topic}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default LecturePlanner;