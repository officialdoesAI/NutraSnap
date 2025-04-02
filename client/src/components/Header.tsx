import { useLocation, useRoute } from "wouter";

const Header = () => {
  const [, navigate] = useLocation();
  const [isHistoryPage] = useRoute("/history");
  const [isResultsPage] = useRoute("/results/:id");
  
  let title = "Scan Food";
  let subtitle = "Take a photo or upload an image of your meal to analyze calories";
  
  if (isHistoryPage) {
    title = "Food History";
    subtitle = "Your recent meal scans";
  } else if (isResultsPage) {
    title = "Analysis Results";
    subtitle = "AI-powered calorie estimation";
  }

  return (
    <header className="px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="text-primary mr-2">Nutri</span>Lens
          <span className="ml-2 text-xs bg-[#10B981] text-white px-2 py-0.5 rounded-full">
            AI
          </span>
        </h1>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate("/history")}
            className="text-gray-600 hover:text-primary"
          >
            <i className="fas fa-history text-lg"></i>
          </button>
          <button className="text-gray-600 hover:text-primary">
            <i className="fas fa-user-circle text-lg"></i>
          </button>
        </div>
      </div>
      
      {(isHistoryPage || isResultsPage) && (
        <div className="px-4 py-4 -mx-4 -mb-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
