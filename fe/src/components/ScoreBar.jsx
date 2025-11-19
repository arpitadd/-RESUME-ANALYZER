export default function ScoreBar({ label, score }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">{label}</h3>
      <div className="w-full bg-gray-200 h-4 rounded-lg overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 font-medium">{score} / 100</p>
    </div>
  );
}
