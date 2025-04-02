import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import HistoryItem from "@/components/HistoryItem";
import { getAllMealRecords, type MealRecord } from "@/lib/api";

interface GroupedMeals {
  today: MealRecord[];
  yesterday: MealRecord[];
  thisWeek: MealRecord[];
  older: MealRecord[];
}

const HistoryPage: React.FC = () => {
  const { data: meals, isLoading, isError } = useQuery({
    queryKey: ['/api/meals'],
    queryFn: getAllMealRecords,
  });
  
  const groupedMeals = useMemo<GroupedMeals>(() => {
    if (!meals) {
      return { today: [], yesterday: [], thisWeek: [], older: [] };
    }
    
    return meals.reduce<GroupedMeals>(
      (acc, meal) => {
        const date = new Date(meal.timestamp);
        
        if (isToday(date)) {
          acc.today.push(meal);
        } else if (isYesterday(date)) {
          acc.yesterday.push(meal);
        } else if (isThisWeek(date)) {
          acc.thisWeek.push(meal);
        } else {
          acc.older.push(meal);
        }
        
        return acc;
      },
      { today: [], yesterday: [], thisWeek: [], older: [] }
    );
  }, [meals]);
  
  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-24 w-full mb-3" />
        <Skeleton className="h-24 w-full mb-3" />
        <Skeleton className="h-24 w-full mb-3" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading History</h3>
        <p className="text-gray-500">Unable to load your meal history</p>
      </div>
    );
  }
  
  if (meals && meals.length === 0) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <i className="fas fa-utensils text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-medium mb-2">No Meals Yet</h3>
        <p className="text-gray-500 text-center mb-4">Scan your first meal to start tracking your calories</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-auto p-4">
      {groupedMeals.today.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Today</h3>
          {groupedMeals.today.map((meal) => (
            <HistoryItem key={meal.id} meal={meal} />
          ))}
        </div>
      )}
      
      {groupedMeals.yesterday.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Yesterday</h3>
          {groupedMeals.yesterday.map((meal) => (
            <HistoryItem key={meal.id} meal={meal} />
          ))}
        </div>
      )}
      
      {groupedMeals.thisWeek.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">This Week</h3>
          {groupedMeals.thisWeek.map((meal) => (
            <HistoryItem key={meal.id} meal={meal} />
          ))}
        </div>
      )}
      
      {groupedMeals.older.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Older</h3>
          {groupedMeals.older.map((meal) => (
            <HistoryItem key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
