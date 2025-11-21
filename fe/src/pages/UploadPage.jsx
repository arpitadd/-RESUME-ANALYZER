import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, Sparkles, TrendingUp, Target } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-3">
            AI Placement Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI analyze it instantly. Get your ATS score, personalized job matches, and actionable insights.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 shadow-2xl rounded-3xl border border-sky-100">
          {/* LOADING SCREEN */}
          {loading && (
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                <p className="text-2xl font-bold mb-2">Analyzing Your Resume</p>
                <p className="text-sky-100 text-sm mb-6">This may take up to a minute...</p>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {loadingMessages[messageIndex]}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full bg-white/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((messageIndex + 1) / loadingMessages.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
                  dragActive 
                    ? "bg-sky-50 border-sky-400 scale-105 shadow-lg" 
                    : file 
                    ? "bg-sky-50/50 border-sky-300" 
                    : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
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
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                />

                {!file ? (
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer block"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-sky-100 p-4 rounded-full">
                        <Upload className="w-10 h-10 text-sky-600" />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      Drop your resume here
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    <span className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                      Browse Files
                    </span>
                    <p className="text-sm text-gray-400 mt-4">
                      Supports PDF and DOCX • Max 10MB
                    </p>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-white p-4 rounded-full shadow-md">
                      <FileText className="w-10 h-10 text-sky-600" />
                    </div>
                    <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      onClick={() => setFile(null)}
                      className="text-sky-600 hover:text-sky-700 text-sm font-medium underline"
                    >
                      Change file
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <button
                disabled={!file || loading}
                onClick={handleUpload}
                className="mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Features Section */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-sky-100 text-center">
              <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">ATS Score</h3>
              <p className="text-sm text-gray-600">Get your resume compatibility score</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-sky-100 text-center">
              <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Job Matches</h3>
              <p className="text-sm text-gray-600">Find roles that fit your profile</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-sky-100 text-center">
              <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">AI Insights</h3>
              <p className="text-sm text-gray-600">Actionable improvement tips</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}