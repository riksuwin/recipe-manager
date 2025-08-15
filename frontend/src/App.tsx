import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MyRecipes from "./pages/MyRecipes";

export default function App() {
  return (
    <div>
      <nav className="flex gap-4 bg-blue-600 text-white p-4">
        <Link to="/">Home</Link>
        <Link to="/my-recipes">My Recipes</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
      </Routes>
    </div>
  );
}
