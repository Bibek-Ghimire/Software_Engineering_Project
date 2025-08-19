// src/pages/AddResource.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AddResource = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [uploadedBy, setUploadedBy] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !title || !uploadedBy) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const resourceURL = URL.createObjectURL(file); // Temp URL

    const newResource = {
      id: Date.now(),
      title,
      type,
      uploadedBy,
      link: resourceURL,
      fileName: file.name,
    };

    const stored = JSON.parse(localStorage.getItem("resources")) || [];
    localStorage.setItem("resources", JSON.stringify([newResource, ...stored]));

    navigate("/resources");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            📤 Upload a Learning Resource
          </h2>

          <label className="block mb-4">
            <span className="font-semibold text-gray-700">Title *</span>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="font-semibold text-gray-700">Resource Type *</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>PDF</option>
              <option>DOCX</option>
              <option>Image</option>
              <option>Video</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block mb-4">
            <span className="font-semibold text-gray-700">Uploaded By *</span>
            <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="font-semibold text-gray-700">Upload File *</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.mp4"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-2"
              required
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">📎 {file.name} selected</p>
            )}
          </label>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Upload Resource
          </button>
        </form>
      </div>
    </>
  );
};

export default AddResource;
