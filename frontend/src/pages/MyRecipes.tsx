import { useState, useEffect } from "react";
import type { Recipe } from "../types/recipe";
import RecipeForm from "../components/RecipeForm";
import RecipeCard from "../components/RecipeCard";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [modalId, setModalId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/list`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  const addRecipe = async (recipe: Recipe) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/recipes/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to add recipe: ${errorData.error || res.statusText}`);
        return;
      }
      const newRecipe = await res.json();
      setRecipes((prev) => [newRecipe, ...prev]);
    } catch (err) {
      alert(`Network error: ${err}`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <RecipeForm onAdd={addRecipe} />
      <div className="flex flex-wrap gap-4">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            className="border rounded p-3 font-semibold bg-gray-50 hover:bg-gray-100 transition m-1 min-w-[120px] text-center shadow"
            style={{ flex: "0 0 auto" }}
            onClick={() => setModalId(recipe.id)}
          >
            {recipe.title}
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <div className="flex justify-end mb-2">
              <button
                className="text-gray-800 hover:text-gray-800 text-3xl font-bold"
                onClick={() => setModalId(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {editMode && editRecipe ? (
              <form
                className="space-y-2 mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch(
                      `${import.meta.env.VITE_BACKEND_URL}/recipes/${
                        editRecipe.id
                      }`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editRecipe),
                      }
                    );
                    if (!res.ok) {
                      const errorData = await res.json();
                      alert(
                        `Failed to update recipe: ${
                          errorData.error || res.statusText
                        }`
                      );
                      return;
                    }
                    const updated = await res.json();
                    setRecipes(
                      recipes.map((r) => (r.id === updated.id ? updated : r))
                    );
                    setEditMode(false);
                    setEditRecipe(null);
                  } catch (err) {
                    alert(`Network error: ${err}`);
                    console.error(err);
                  }
                }}
              >
                <input
                  className="border p-2 w-full rounded"
                  value={editRecipe.title}
                  onChange={(e) =>
                    setEditRecipe({ ...editRecipe, title: e.target.value })
                  }
                  placeholder="Dish Name"
                  required
                />
                <textarea
                  className="border p-2 w-full rounded"
                  value={editRecipe.description}
                  onChange={(e) =>
                    setEditRecipe({
                      ...editRecipe,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  required
                />
                <input
                  className="border p-2 w-full rounded"
                  value={editRecipe.ingredients.join(", ")}
                  onChange={(e) =>
                    setEditRecipe({
                      ...editRecipe,
                      ingredients: e.target.value
                        .split(",")
                        .map((i) => i.trim()),
                    })
                  }
                  placeholder="Ingredients (comma separated)"
                  required
                />
                <input
                  className="border p-2 w-full rounded"
                  value={editRecipe.instructions.join(", ")}
                  onChange={(e) =>
                    setEditRecipe({
                      ...editRecipe,
                      instructions: e.target.value
                        .split(",")
                        .map((i) => i.trim()),
                    })
                  }
                  placeholder="Instructions (comma separated)"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => {
                      setEditMode(false);
                      setEditRecipe(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <RecipeCard recipe={recipes.find((r) => r.id === modalId)!} />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition font-semibold"
                    onClick={() => {
                      const r = recipes.find((r) => r.id === modalId);
                      if (r) {
                        setEditRecipe({ ...r });
                        setEditMode(true);
                      }
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold"
                    onClick={async () => {
                      if (modalId === null) return;
                      try {
                        const res = await fetch(
                          `${
                            import.meta.env.VITE_BACKEND_URL
                          }/recipes/${modalId}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (!res.ok) {
                          const errorData = await res.json();
                          alert(
                            `Failed to delete recipe: ${
                              errorData.error || res.statusText
                            }`
                          );
                          return;
                        }
                        setRecipes(recipes.filter((r) => r.id !== modalId));
                        setModalId(null);
                      } catch (err) {
                        alert(`Network error: ${err}`);
                        console.error(err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
