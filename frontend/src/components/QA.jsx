import { useState } from "react";
import axios from "axios";

function QA(){

  const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");

  const askQuestion = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/ask",
        { question }
      );

      setAnswer(res.data.answer);

    } catch (error) {

      console.error(error);
      alert("Error getting answer");

    }
  }

  return(

    <div>

      <h2>Ask Question</h2>

      <input
        type="text"
        placeholder="Ask something..."
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
      />

      <button onClick={askQuestion}>
        Ask
      </button>

      <p>{answer}</p>

    </div>
  )
}

export default QA