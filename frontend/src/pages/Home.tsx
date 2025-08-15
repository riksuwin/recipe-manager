import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome to Recipe Manager</h1>
      <p className="text-gray-600 mt-2">
        Store and manage your favorite recipes.
      </p>
      <Link
        to="/my-recipes"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold mt-4"
      >
        Go to My Recipes
      </Link>
    </div>
  );
}
