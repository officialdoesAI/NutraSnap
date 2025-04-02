import React from "react";
import { FoodItem } from "@/lib/api";

interface FoodResultProps {
  item: FoodItem;
}

const FoodResult: React.FC<FoodResultProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{item.name}</h4>
          <div className="text-sm text-gray-500">{item.description}</div>
          <div className="text-xs text-gray-400 mt-1">{item.servingSize}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-800">{item.calories}</div>
          <div className="text-xs text-gray-500">calories</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-500">Protein</div>
            <div className="font-medium text-sm">{item.macros.protein}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Carbs</div>
            <div className="font-medium text-sm">{item.macros.carbs}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Fat</div>
            <div className="font-medium text-sm">{item.macros.fat}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs">
        <button className="text-primary hover:underline">Edit this item</button>
      </div>
    </div>
  );
};

export default FoodResult;
