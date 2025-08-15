import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const router = Router();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// GET all recipes (now at /recipes/list)
router.get("/list", async (_req, res) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new recipe (now at /recipes/create)
router.post("/create", async (req, res) => {
  console.log("POST /recipes/create body:", req.body);
  const { title, description, ingredients, instructions } = req.body;
  if (!title || !description || !instructions) {
    return res.status(400).json({ error: "Title, description, and instructions are required" });
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert([{ title, description, ingredients, instructions }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// UPDATE a recipe
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions } = req.body;

  const { data, error } = await supabase
    .from("recipes")
    .update({ title, description, ingredients, instructions })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE a recipe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Recipe deleted successfully" });
});

export default router;
