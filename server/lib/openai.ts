import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface FoodAnalysisResult {
  name: string;
  totalCalories: number;
  confidenceScore: number;
  items: FoodItem[];
}

export interface FoodItem {
  name: string;
  description: string;
  servingSize: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
  try {
    const prompt = `
      Analyze this food image and provide detailed nutritional information.
      Identify all distinct food items in the image.
      For each item, provide:
      1. Name
      2. Brief description
      3. Estimated serving size
      4. Estimated calories
      5. Macronutrients (protein, carbs, fat) in grams
      
      Also provide:
      - Total calories for the entire meal
      - Confidence score (0-100) for your analysis
      
      Format your response as a JSON object with this structure:
      {
        "name": "Meal name (breakfast/lunch/dinner/snack based on the food)",
        "totalCalories": number,
        "confidenceScore": number,
        "items": [
          {
            "name": "Food item name",
            "description": "Brief description",
            "servingSize": "Estimated serving size",
            "calories": number,
            "macros": {
              "protein": "Xg",
              "carbs": "Xg",
              "fat": "Xg"
            }
          }
        ]
      }
    `;

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(visionResponse.choices[0].message.content || "{}");
    return result as FoodAnalysisResult;

  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error(`Failed to analyze food image: ${error.message}`);
  }
}
