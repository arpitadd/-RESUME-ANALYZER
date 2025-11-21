import { Building2, TrendingUp, CheckCircle2, AlertCircle, Sparkles, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function CompanyCard({ role, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate percentage for visual representation
  const fitPercentage = role.fit_score;
  
  // Determine color scheme based on fit score
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', ring: 'ring-green-500' };
    if (score >= 60) return { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', ring: 'ring-sky-500' };
    return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'ring-amber-500' };
  };
  
  const scoreColors = getScoreColor(role.fit_score);

  return (
    <div className="group bg-white hover:bg-sky-50/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-sky-100 hover:border-sky-200 transition-all duration-300 relative overflow-hidden">
      {/* Ranking Badge */}
      {index !== undefined && index < 3 && (
        <div className="absolute top-4 right-4 bg-gradient-to-br from-sky-400 to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
          #{index + 1}
        </div>
      )}

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full filter blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

      {/* Company Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="bg-gradient-to-br from-sky-100 to-blue-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Building2 className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
              {role.company_name}
            </h3>
            <p className="text-gray-600 font-medium mt-0.5">{role.role_title}</p>
          </div>
        </div>
      </div>

      {/* Fit Score Section */}
      <div className={`${scoreColors.bg} ${scoreColors.border} border-2 rounded-xl p-4 mb-4 relative overflow-hidden`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${scoreColors.text}`} />
            <p className="text-sm font-semibold text-gray-700">Fit Score</p>
          </div>
          <div className={`${scoreColors.text} font-bold text-2xl flex items-baseline gap-1`}>
            {role.fit_score}
            <span className="text-sm font-medium">/100</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-white rounded-full h-2.5 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${
              fitPercentage >= 80 ? 'from-green-400 to-green-600' : 
              fitPercentage >= 60 ? 'from-sky-400 to-blue-600' : 
              'from-amber-400 to-orange-600'
            }`}
            style={{ width: `${fitPercentage}%` }}
          ></div>
        </div>
        
        {/* Score Label */}
        <p className="text-xs text-gray-600 mt-2 text-center font-medium">
          {fitPercentage >= 80 ? 'Excellent Match' : fitPercentage >= 60 ? 'Good Match' : 'Potential Match'}
        </p>
      </div>

      {/* Strengths Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-green-100 p-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-semibold text-green-700 text-sm">Strengths</p>
        </div>
        <div className="space-y-2">
          {role.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 bg-green-50 p-2.5 rounded-lg border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-100 p-1.5 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-semibold text-amber-700 text-sm">Areas to Develop</p>
        </div>
        <div className="space-y-2">
          {role.gaps.map((g, i) => (
            <div key={i} className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{g}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="pt-4 border-t border-sky-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <p className="font-semibold text-gray-700 text-sm">AI Summary</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-br from-sky-50/50 to-blue-50/50 p-3 rounded-lg border border-sky-100">
          {role.summary}
        </p>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-sky-100 space-y-3 animate-fadeIn">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-lg border border-sky-100">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Why This Match?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our AI analyzed your resume against this role's requirements and found strong alignment in key areas. 
              Your experience and skills match {role.fit_score}% of the job requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-lg border border-sky-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Match Quality</p>
              <p className="font-bold text-sky-600">
                {role.fit_score >= 80 ? 'High' : role.fit_score >= 60 ? 'Medium' : 'Fair'}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-sky-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Strengths Found</p>
              <p className="font-bold text-green-600">{role.strengths.length}</p>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
            <h4 className="font-semibold text-amber-800 mb-2 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Next Steps
            </h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Research {role.company_name}'s recent projects and culture</li>
              <li>• Tailor your resume to highlight relevant strengths</li>
              <li>• Prepare examples addressing the skill gaps identified</li>
              <li>• Connect with current employees on LinkedIn</li>
            </ul>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Less
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            View Full Details
          </>
        )}
      </button>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}