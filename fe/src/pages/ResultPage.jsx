import { useLocation, useNavigate } from "react-router-dom";
import ScoreBar from "../components/ScoreBar";
import CompanyCard from "../components/CompanyCard";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={() => navigate("/")} className="text-blue-600 underline">Go to upload</button>
    </div>
  );

  const { ats_score, recommendations } = state;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <button onClick={() => navigate("/")} className="text-blue-600 underline mb-4">
        ← Upload another resume
      </button>

      <h1 className="text-3xl font-bold">Your Results</h1>

      <div className="mt-6">
        <ScoreBar label="ATS Score" score={ats_score} />
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Top Company Matches</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((role, i) => (
          <CompanyCard key={i} role={role} />
        ))}
      </div>
    </div>
  );
}
