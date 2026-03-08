import axios from "axios";

function Upload() {

  const uploadFile = async (event) => {

    const file = event.target.files[0];

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      alert("PDF Uploaded Successfully");

    } catch (error) {

      console.error(error);
      alert("Upload Failed");

    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={uploadFile}/>
    </div>
  );
}

export default Upload;