export default function CompanyCard({ role }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="text-xl font-bold">{role.company_name}</h3>
      <p className="text-gray-700 font-medium">{role.role_title}</p>

      <div className="mt-3">
        <p className="text-sm font-semibold">Fit Score:</p>
        <p className="font-bold text-blue-600 text-lg">{role.fit_score} / 100</p>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-green-700">Strengths:</p>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {role.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-red-700">Gaps:</p>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {role.gaps.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>

      <div className="mt-3 text-gray-600 text-sm">
        <p className="font-semibold">Summary:</p>
        <p>{role.summary}</p>
      </div>
    </div>
  );
}
