import axios from "axios";
import { useState } from "react";

function Upload() {

  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      setUploading(true);

      setStatus("Uploading...");

      await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setUploading(false);

      setStatus("Uploaded successfully");

    }

    catch (error) {

      console.error(error);

      setUploading(false);

      setStatus("Upload failed");

    }

  };

  return (

    <div>

      <h2>Upload PDF</h2>

      <input
        type="file"
        onChange={uploadFile}
      />

      {/* STATUS MESSAGE */}

      {status && (

        <p
          style={{
            marginTop: "10px",
            fontWeight: "500",
            color: uploading ? "#7c3aed" : "#16a34a"
          }}
        >

          {status}

        </p>

      )}

    </div>

  );

}

export default Upload;