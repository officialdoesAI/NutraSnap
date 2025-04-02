import { useLocation } from "wouter";
import { Camera, History, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="border-t border-gray-200 bg-white py-3 sticky bottom-0 shadow-md">
      <div className="flex justify-around">
        <button 
          onClick={() => navigate("/")}
          className={`flex flex-col items-center w-24 py-1 ${
            location === "/" 
              ? "text-primary font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Camera className="h-6 w-6 mb-1" />
          <span className="text-xs">Scan</span>
        </button>
        
        <button 
          onClick={() => navigate("/history")}
          className={`flex flex-col items-center w-24 py-1 ${
            location === "/history" 
              ? "text-primary font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History className="h-6 w-6 mb-1" />
          <span className="text-xs">History</span>
        </button>
        
        <button 
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center w-24 py-1 ${
            location === "/profile" 
              ? "text-primary font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
