import { useState } from "react";
import axios from "axios";

function Summary(){

  const [summary,setSummary] = useState("");

  const generateSummary = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/summary"
      );

      setSummary(res.data.summary);

    } catch (error) {

      console.error(error);
      alert("Error generating summary");

    }

  }

  return(

    <div>

      <h2>Document Summary</h2>

      <button onClick={generateSummary}>
        Generate Summary
      </button>

      <p>{summary}</p>

    </div>
  )
}

export default Summary