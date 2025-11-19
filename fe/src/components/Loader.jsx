export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-4"></div>

      {/* Text */}
      <p className="text-white text-lg font-medium">
        Analyzing your resume… Stay tuned!
      </p>

      <p className="text-gray-200 text-sm mt-1">
        This may take a few seconds.
      </p>
    </div>
  );
}
