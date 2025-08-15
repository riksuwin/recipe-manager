// Capitalize first letter helper
const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
import { useState } from "react";
import type { Recipe } from "../types/recipe";

interface Props {
  recipe: Recipe;
  onChange: (r: Recipe) => void;
  onCancel: () => void;
  onSave: (r: Recipe) => void;
}

export default function EditRecipeForm({
  recipe,
  onChange,
  onCancel,
  onSave,
}: Props) {
  // Instructions state
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [instructionInput, setInstructionInput] = useState("");
  const [instructions, setInstructions] = useState<string[]>(
    recipe.instructions
  );
  // Ingredients state (interactive)
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingEditingIdx, setIngEditingIdx] = useState<number | null>(null);
  const [ingEditingValue, setIngEditingValue] = useState("");

  // Sync local instructions/ingredients with parent on change
  const updateInstructions = (newInstructions: string[]) => {
    setInstructions(newInstructions);
    onChange({ ...recipe, instructions: newInstructions });
  };
  const updateIngredients = (newIngredients: string[]) => {
    setIngredients(newIngredients);
    onChange({ ...recipe, ingredients: newIngredients });
  };

  return (
    <form
      className="space-y-2 mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...recipe, instructions });
      }}
    >
      <label className="block mb-1 font-medium">Dish Name</label>
      <input
        className="border p-2 w-full rounded"
        value={recipe.title}
        onChange={(e) => onChange({ ...recipe, title: e.target.value })}
        required
      />
      <label className="block mb-1 font-medium">Description</label>
      <textarea
        className="border p-2 w-full mb-2 rounded resize-y min-h-[40px] max-h-30 overflow-auto"
        value={recipe.description}
        onChange={(e) => onChange({ ...recipe, description: e.target.value })}
        required
      />
      <label className="block mb-1 font-medium">Ingredients</label>
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Add an ingredient and press Enter"
        value={ingredientInput}
        onChange={(e) => setIngredientInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && ingredientInput.trim()) {
            e.preventDefault();
            const formatted = capitalizeFirst(ingredientInput.trim());
            updateIngredients([...ingredients, formatted]);
            setIngredientInput("");
          }
        }}
      />
      {ingredients.length > 0 && (
        <ul className="list-none mb-2 text-gray-700 border border-gray-300 rounded p-3 bg-white max-h-28 overflow-y-auto">
          {ingredients.map((ing, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between group py-1"
            >
              {ingEditingIdx === idx ? (
                <>
                  <input
                    className="border p-1 rounded w-full mr-2"
                    value={ingEditingValue}
                    onChange={(e) => setIngEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && ingEditingValue.trim()) {
                        updateIngredients(
                          ingredients.map((v, i) =>
                            i === idx ? ingEditingValue.trim() : v
                          )
                        );
                        setIngEditingIdx(null);
                        setIngEditingValue("");
                      } else if (e.key === "Escape") {
                        setIngEditingIdx(null);
                        setIngEditingValue("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    className="ml-1 text-green-600 hover:text-green-800"
                    title="Save"
                    type="button"
                    onClick={() => {
                      if (ingEditingValue.trim()) {
                        updateIngredients(
                          ingredients.map((v, i) =>
                            i === idx ? ingEditingValue.trim() : v
                          )
                        );
                        setIngEditingIdx(null);
                        setIngEditingValue("");
                      }
                    }}
                  >
                    &#10003;
                  </button>
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    title="Cancel"
                    type="button"
                    onClick={() => {
                      setIngEditingIdx(null);
                      setIngEditingValue("");
                    }}
                  >
                    &#10005;
                  </button>
                </>
              ) : (
                <>
                  <span>{ing}</span>
                  <span className="flex items-center gap-1 ml-2 opacity-70 group-hover:opacity-100">
                    <button
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit"
                      type="button"
                      onClick={() => {
                        setIngEditingIdx(idx);
                        setIngEditingValue(ing);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M16.475 5.408a2.1 2.1 0 0 1 2.97 2.97L8.5 19.323l-4.243.707.707-4.243 11.511-11.51Z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove"
                      type="button"
                      onClick={() =>
                        updateIngredients(
                          ingredients.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <label className="block mb-1 font-medium">Instructions</label>
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Add an instruction and press `Enter`"
        value={instructionInput}
        onChange={(e) => setInstructionInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && instructionInput.trim()) {
            e.preventDefault();
            updateInstructions([...instructions, instructionInput.trim()]);
            setInstructionInput("");
          }
        }}
      />
      {instructions.length > 0 && (
        <ul className="list-none mb-2 text-gray-700 border border-gray-300 rounded p-3 bg-white max-h-48 overflow-y-auto">
          {instructions.map((inst, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between group py-1"
            >
              {editingIdx === idx ? (
                <>
                  <input
                    className="border p-1 rounded w-full mr-2"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editingValue.trim()) {
                        updateInstructions(
                          instructions.map((v, i) =>
                            i === idx ? editingValue.trim() : v
                          )
                        );
                        setEditingIdx(null);
                        setEditingValue("");
                      } else if (e.key === "Escape") {
                        setEditingIdx(null);
                        setEditingValue("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    className="ml-1 text-green-600 hover:text-green-800"
                    title="Save"
                    type="button"
                    onClick={() => {
                      if (editingValue.trim()) {
                        updateInstructions(
                          instructions.map((v, i) =>
                            i === idx ? editingValue.trim() : v
                          )
                        );
                        setEditingIdx(null);
                        setEditingValue("");
                      }
                    }}
                  >
                    &#10003;
                  </button>
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    title="Cancel"
                    type="button"
                    onClick={() => {
                      setEditingIdx(null);
                      setEditingValue("");
                    }}
                  >
                    &#10005;
                  </button>
                </>
              ) : (
                <>
                  <span>{`Step ${idx + 1}. ${inst}`}</span>
                  <span className="flex items-center gap-1 ml-2 opacity-70 group-hover:opacity-100">
                    <button
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit"
                      type="button"
                      onClick={() => {
                        setEditingIdx(idx);
                        setEditingValue(inst);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M16.475 5.408a2.1 2.1 0 0 1 2.97 2.97L8.5 19.323l-4.243.707.707-4.243 11.511-11.51Z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove"
                      type="button"
                      onClick={() =>
                        updateInstructions(
                          instructions.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
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
  );
}
