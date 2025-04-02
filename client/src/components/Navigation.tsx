import { useLocation } from "wouter";

const Navigation = () => {
  const [location, navigate] = useLocation();

  return (
    <nav className="border-t border-gray-200 bg-white py-3 sticky bottom-0">
      <div className="flex justify-around">
        <button 
          onClick={() => navigate("/")}
          className={`flex flex-col items-center w-16 ${location === "/" ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
        >
          <i className="fas fa-camera text-lg"></i>
          <span className="text-xs mt-1">Scan</span>
        </button>
        
        <button 
          onClick={() => navigate("/history")}
          className={`flex flex-col items-center w-16 ${location === "/history" ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
        >
          <i className="fas fa-history text-lg"></i>
          <span className="text-xs mt-1">History</span>
        </button>
        
        <button className="flex flex-col items-center w-16 text-gray-400 hover:text-gray-600">
          <i className="fas fa-chart-bar text-lg"></i>
          <span className="text-xs mt-1">Stats</span>
        </button>
        
        <button className="flex flex-col items-center w-16 text-gray-400 hover:text-gray-600">
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
