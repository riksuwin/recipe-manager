import { useState } from "react";
import type { Recipe } from "../types/recipe";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

export default function RecipeForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [instructionInput, setInstructionInput] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || instructions.length === 0) return;

    const newRecipe: Recipe = {
      id: Date.now(),
      title,
      description,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      instructions,
    };

    onAdd(newRecipe);
    setTitle("");
    setDescription("");
    setInstructions([]);
    setInstructionInput("");
    setIngredients("");
  };

  const handleInstructionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && instructionInput.trim()) {
      e.preventDefault();
      setInstructions((prev) => [...prev, instructionInput.trim()]);
      setInstructionInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow mb-4"
    >
      <h2 className="text-lg font-bold mb-2">Add New Recipe</h2>
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Dish Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Add instruction and press Enter"
        value={instructionInput}
        onChange={(e) => setInstructionInput(e.target.value)}
        onKeyDown={handleInstructionKeyDown}
      />
      {instructions.length > 0 && (
        <ul className="list-none mb-2 text-gray-700">
          {instructions.map((inst, idx) => (
            <li key={idx} className="flex items-center justify-between group">
              {editingIdx === idx ? (
                <>
                  <input
                    className="border p-1 rounded w-full mr-2"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editingValue.trim()) {
                        setInstructions(
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
                    onClick={() => {
                      if (editingValue.trim()) {
                        setInstructions(
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
                  <span>{`${idx + 1}. ${inst}`}</span>
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
                        setInstructions(
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add Recipe
      </button>
    </form>
  );
}
