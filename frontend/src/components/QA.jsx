import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function QA() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);


  const askQuestion = async () => {

    try {

      // 🔴 CHECK IF PDF UPLOADED FIRST

      const status = await axios.get(
        "http://127.0.0.1:8000/document-status"
      );

      if (!status.data.uploaded) {

        setWarning("⚠ Upload PDF first to use Q&A");
        return;

      }

      // clear warning if document exists

      setWarning("");

      // start loading animation

      setLoading(true);
      setAnswer("");

      // ✅ SEND QUESTION TO BACKEND

      const res = await axios.post(
        "http://127.0.0.1:8000/ask",
        { question }
      );

      setAnswer(res.data.answer);

    }

    catch (error) {

      console.error(error);

      setWarning("Something went wrong while getting answer");

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div>

      <h2>Ask Question</h2>


      <input
        type="text"
        placeholder="Ask something..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ddd"
        }}
      />


      <button
        onClick={askQuestion}
        disabled={loading}
        style={{
          marginLeft: "10px",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >

        {loading ? "Searching..." : "Ask"}

      </button>


      {/* LOADING MESSAGE */}

      {loading && (

        <p
          style={{
            marginTop: "12px",
            color: "#6d5aff",
            fontWeight: "500"
          }}
        >

          🔍 Searching document for answer...

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


      {/* ANSWER OUTPUT */}

      {answer && !loading && (

<div
  style={{
    marginTop: "15px",
    lineHeight: "1.6"
  }}
>
  <ReactMarkdown>{answer}</ReactMarkdown>
</div>

      )}

    </div>

  );

}

export default QA;