import React from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { MealRecord } from "@/lib/api";

interface HistoryItemProps {
  meal: MealRecord;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ meal }) => {
  const [, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(`/results/${meal.id}`);
  };
  
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };
  
  // Get first 3 food items for the summary
  const foodItemsSummary = meal.foodItems
    .slice(0, 3)
    .map(item => item.name)
    .join(", ");
  
  return (
    <div 
      className="history-item bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm mb-3 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex">
        <div className="w-24 h-24">
          <img 
            src={meal.imageData} 
            alt="Food image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-3">
          <div className="flex justify-between">
            <h4 className="font-medium text-gray-800">{meal.name}</h4>
            <span className="font-bold text-[#F97316]">{meal.totalCalories} cal</span>
          </div>
          <p className="text-xs text-gray-500 mb-1">{foodItemsSummary}</p>
          <div className="flex items-center text-xs text-gray-400">
            <i className="fas fa-clock mr-1"></i>
            <time>{formatTime(meal.timestamp)}</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
