import React from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FoodResult from "@/components/FoodResult";
import { getMealRecord } from "@/lib/api";

const ResultsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  const { data: meal, isLoading, isError } = useQuery({
    queryKey: ['/api/meals', parseInt(params.id || "0")],
    queryFn: () => {
      if (!params.id) throw new Error("No meal ID provided");
      return getMealRecord(parseInt(params.id));
    },
    enabled: !!params.id,
  });

  const handleScanAgain = () => {
    navigate("/");
  };
  
  if (isLoading) {
    return <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-8" />
      <Skeleton className="w-full h-24 mb-3" />
      <Skeleton className="w-full h-24 mb-3" />
      <Skeleton className="w-full h-24 mb-3" />
    </div>;
  }
  
  if (isError || !meal) {
    return <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <h3 className="text-xl font-medium mb-2">Error Loading Results</h3>
      <p className="text-gray-500 mb-4">Unable to load meal analysis results</p>
      <Button onClick={handleScanAgain}>Scan Again</Button>
    </div>;
  }
  
  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), "MMMM d, h:mm a");
  };
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <img 
            src={meal.imageData} 
            alt="Food image" 
            className="w-full h-48 object-cover"
          />
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{meal.name}</h3>
              <span className="text-xl font-bold text-[#F97316]">{meal.totalCalories} cal</span>
            </div>
            
            <div className="flex mb-3">
              <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">AI Estimated</span>
              <span className="text-xs text-gray-400 ml-2">
                <time dateTime={meal.timestamp}>{formatDate(meal.timestamp)}</time>
              </span>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-700 mb-3">Detected Food Items</h3>
        
        {meal.foodItems.map((item, index) => (
          <FoodResult key={index} item={item} />
        ))}
        
        {/* AI Confidence */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-start">
            <div className="text-primary mr-3">
              <i className="fas fa-robot text-lg"></i>
            </div>
            <div>
              <h4 className="font-medium text-sm">AI Confidence Level</h4>
              <div className="text-xs text-gray-500 mb-2">
                Our AI is {meal.confidenceScore}% confident in this analysis
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{width: `${meal.confidenceScore}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mb-6">
          <Button
            className="flex-1 bg-[#10B981] text-white py-3 rounded-lg font-medium hover:bg-green-600"
            onClick={() => navigate("/history")}
          >
            <i className="fas fa-list-ul mr-2"></i>
            View All Meals
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
            onClick={handleScanAgain}
          >
            <i className="fas fa-camera mr-2"></i>
            Scan Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
