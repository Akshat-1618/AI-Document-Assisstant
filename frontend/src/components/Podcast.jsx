import { useState, useEffect, useRef } from "react";

export default function Podcast() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [script, setScript] = useState([]);

  const audioRef = useRef(null);

  const loadingMessages = [
    "🧠 Alex and Sam are discussing...",
    "🎙️ Turning text into conversation...",
    "✨ Crafting your podcast ...",
    "🚀 Almost ready — stay with us...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  const generatePodcast = async () => {
    if (!file) return;

    setLoading(true);
    setAudioUrl(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch(
        "http://127.0.0.1:8000/generate-podcast",

        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      setAudioUrl(data.audio_url);
      setScript(data.script);
    } catch (err) {
      console.error(err);
      alert("Podcast generation failed");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}

      <div style={styles.headerCard}>
        <h2 style={styles.title}>🎙️ Document Podcast Generator</h2>

        <p style={styles.subtitle}>
          Turn your PDF into an engaging AI conversation
        </p>

        <input
          type="file"
          accept="application/pdf"
          style={styles.fileInput}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button style={styles.generateBtn} onClick={generatePodcast}>
          Generate Podcast
        </button>
      </div>

      {/* LOADING STATE */}

      {loading && (
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />

          <p style={styles.loadingText}>{loadingMessages[messageIndex]}</p>
        </div>
      )}

      {/* AUDIO RESULT */}

      {audioUrl && (
        <div style={styles.resultCard}>
          <h3 style={styles.readyTitle}>🎧 Your Podcast is Ready</h3>

          <audio
            ref={audioRef}
            controls
            style={styles.audioPlayer}
            src={audioUrl}
          />

          {/* TRANSCRIPT */}

          <details style={styles.transcriptCard}>
            <summary style={styles.transcriptTitle}>
              View Transcript (Alex & Sam)
            </summary>

            <div style={styles.transcriptBody}>
              {script.map((line, index) => (
                <p key={index} style={styles.line}>
                  <span
                    style={line.speaker === "Alex" ? styles.alex : styles.sam}
                  >
                    {line.speaker}
                  </span>

                  {line.text}
                </p>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    maxWidth: "720px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  headerCard: {
    background: "linear-gradient(135deg,#6d5aff,#8b77ff)",

    padding: "30px",

    borderRadius: "18px",

    color: "white",

    boxShadow: "0 8px 30px rgba(109,90,255,.35)",
  },

  title: {
    marginBottom: "8px",
  },

  subtitle: {
    opacity: 0.9,
    marginBottom: "20px",
  },

  fileInput: {
    marginBottom: "20px",
  },

  generateBtn: {
    background: "white",
    color: "#6d5aff",

    padding: "10px 18px",

    borderRadius: "10px",

    fontWeight: "600",

    border: "none",

    cursor: "pointer",

    transition: "0.2s",
  },

  loadingCard: {
    background: "white",

    padding: "25px",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow: "0 6px 18px rgba(0,0,0,.08)",
  },

  spinner: {
    width: "40px",
    height: "40px",

    border: "4px solid #eee",
    borderTop: "4px solid #6d5aff",

    borderRadius: "50%",

    margin: "auto",

    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "15px",

    fontWeight: "500",

    color: "#6d5aff",
  },

  resultCard: {
    background: "white",

    padding: "25px",

    borderRadius: "18px",

    boxShadow: "0 10px 28px rgba(0,0,0,.08)",
  },

  readyTitle: {
    marginBottom: "15px",
  },

  audioPlayer: {
    width: "100%",
    marginBottom: "15px",
  },

  transcriptCard: {
    background: "#fafaff",

    padding: "15px",

    borderRadius: "12px",
  },

  transcriptTitle: {
    cursor: "pointer",

    fontWeight: "600",

    color: "#6d5aff",
  },

  transcriptBody: {
    marginTop: "10px",
  },

  line: {
    marginBottom: "10px",
  },

  alex: {
    fontWeight: "700",

    color: "#6d5aff",

    marginRight: "6px",
  },

  sam: {
    fontWeight: "700",

    color: "#22c55e",

    marginRight: "6px",
  },
};
