import type { Recipe } from "../types/recipe";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="p-4 shadow hover:shadow-lg transition bg-white">
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-600 mb-2">{recipe.description}</p>
      <h3 className="font-semibold">Ingredients:</h3>
      <ul className="list-disc list-inside text-gray-700">
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {recipe.instructions && recipe.instructions.length > 0 && (
        <>
          <h3 className="font-semibold mt-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-gray-700">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
