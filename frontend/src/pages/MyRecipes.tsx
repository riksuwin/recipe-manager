import { useState, useEffect } from "react";
import type { Recipe } from "../types/recipe";
import RecipeForm from "../components/RecipeForm";
import EditRecipeForm from "../components/EditRecipeForm";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [modalId, setModalId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  // Confirmation state for Add Recipe
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter recipes by ingredient
  const filteredRecipes: Recipe[] = search.trim()
    ? recipes.filter((recipe: Recipe) =>
        recipe.ingredients.some((ingredient: string) =>
          ingredient.toLowerCase().includes(search.trim().toLowerCase())
        )
      )
    : recipes;

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
    <div className="max-w-7xl w-full p-4 relative">
      <div className="flex items-center gap-4 absolute left-0 top-0 mt-4 ml-4 z-10">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold shadow"
          onClick={() => setShowAddModal(true)}
        >
          + Add Recipe
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by ingredient..."
          className="border rounded px-3 py-2 min-w-[220px] focus:outline-none focus:ring focus:border-blue-300 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4 mt-16">
        {filteredRecipes.length === 0 ? (
          <div className="text-black italic p-8">
            No recipes found with that ingredient.
          </div>
        ) : (
          filteredRecipes.map((recipe: Recipe) => (
            <button
              key={recipe.id}
              className="border rounded-xl p-6 font-semibold bg-gray-50 hover:bg-blue-100 transition m-1 min-w-[180px] min-h-[220px] max-w-[280px] flex flex-col justify-center items-center text-center shadow-lg"
              style={{ flex: "0 0 auto" }}
              onClick={() => setModalId(recipe.id)}
            >
              <span className="text-lg font-bold mb-2 break-words">
                {recipe.title}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                className="text-gray-800 hover:text-gray-800 text-3xl font-bold"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <RecipeForm
              onAdd={(recipe) => {
                setPendingRecipe(recipe);
                setShowConfirm(true);
              }}
            />
            {/* Confirmation Popup */}
            {showConfirm && (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
                  <div className="text-lg font-semibold mb-4">Is that all?</div>
                  <div className="flex gap-4">
                    <button
                      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                        isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                      onClick={async () => {
                        if (isSubmitting) return;
                        setIsSubmitting(true);
                        if (pendingRecipe) {
                          await addRecipe(pendingRecipe);
                        }
                        setShowAddModal(false);
                        setShowConfirm(false);
                        setPendingRecipe(null);
                        setIsSubmitting(false);
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Yes"}
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (isSubmitting) return;
                        setShowConfirm(false);
                        setPendingRecipe(null);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* View/Edit Modal */}
      {modalId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
            <div className="flex justify-end mb-2">
              <button
                className="text-gray-800 hover:text-gray-800 text-3xl font-bold"
                onClick={() => {
                  setModalId(null);
                  setEditMode(false);
                  setEditRecipe(null);
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {editMode && editRecipe ? (
              <EditRecipeForm
                recipe={editRecipe}
                onChange={setEditRecipe}
                onCancel={() => {
                  setEditMode(false);
                  setEditRecipe(null);
                }}
                onSave={async (updatedRecipe) => {
                  try {
                    const res = await fetch(
                      `${import.meta.env.VITE_BACKEND_URL}/recipes/${
                        updatedRecipe.id
                      }`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedRecipe),
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
              />
            ) : (
              (() => {
                const recipe = recipes.find((r) => r.id === modalId)!;
                return (
                  <>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="basis-1/3 min-w-[180px] max-w-[300px]">
                        <h2 className="text-2xl font-bold mb-2">
                          {recipe.title}
                        </h2>
                        <p className="text-gray-600 mb-4 whitespace-pre-line">
                          {recipe.description}
                        </p>
                      </div>
                      <div className="basis-2/3 min-w-[220px]">
                        <h3 className="font-semibold mb-1">Ingredients:</h3>
                        <div className="flex gap-8 mb-4">
                          {Array.from({
                            length: Math.ceil(recipe.ingredients.length / 6),
                          }).map((_, colIdx) => (
                            <ul
                              key={colIdx}
                              className="list-disc list-inside text-gray-700 min-w-[120px]"
                            >
                              {recipe.ingredients
                                .slice(colIdx * 6, (colIdx + 1) * 6)
                                .map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                            </ul>
                          ))}
                        </div>
                        {recipe.instructions &&
                          recipe.instructions.length > 0 && (
                            <>
                              <h3 className="font-semibold mb-1">
                                Instructions:
                              </h3>
                              <ol className="list-decimal list-inside text-gray-700 max-h-48 overflow-y-auto pr-2">
                                {recipe.instructions.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </>
                          )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
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
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this recipe?"
                          );
                          if (!confirmDelete) return;
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
                            setEditMode(false);
                            setEditRecipe(null);
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
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
