import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  const loadingMessages = [
    "Extracting text from your resume…",
    "Scanning skills, education, and experience…",
    "Generating AI embedding for similarity search…",
    "Matching your profile across all company roles…",
    "Analyzing strengths, gaps, and ATS patterns…",
    "Preparing your personalized predictions…",
    "Almost done — finalizing your results…"
  ];

  // 🔥 Sequential loading messages every 10 seconds
  useEffect(() => {
    if (!loading) return;

    setMessageIndex(0);

    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 10000); // 10 seconds per message

    return () => clearInterval(interval);
  }, [loading]);

  const validateFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Only PDF or DOCX allowed");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Max size: 10MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return setError("Choose a file first");

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:3000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze resume");

      const data = await res.json();
      navigate("/result", { state: data });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-xl w-full bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-4">
          AI Placement Predictor
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Upload your resume to get instant ATS score & job matches
        </p>

        {/* LOADING SCREEN */}
        {loading && (
          <div className="mt-6 text-center bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            </div>

            <p className="text-lg font-semibold">Analyzing your resume…</p>

            <p className="text-gray-300 text-xs mt-3 italic">
              {loadingMessages[messageIndex]}
            </p>
          </div>
        )}

        {!loading && (
          <>
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                dragActive ? "bg-blue-50 border-blue-500" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!file ? (
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer text-gray-600"
                >
                  Drag and drop here or{" "}
                  <span className="text-blue-600 font-semibold">browse</span>
                </label>
              ) : (
                <p className="font-medium text-gray-700">{file.name}</p>
              )}
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}

            <button
              disabled={!file || loading}
              onClick={handleUpload}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-300"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
