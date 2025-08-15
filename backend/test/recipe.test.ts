
import request from "supertest";
import app from "../src/index";
import { describe, it, expect } from "vitest";

describe("GET /recipes/list", () => {
  it("should return a list of recipes (array)", async () => {
    const res = await request(app).get("/recipes/list");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /recipes/create", () => {
  it("should create a new recipe and return success", async () => {
    const newRecipe = {
      title: "Test Recipe",
      description: "A test recipe description",
      ingredients: ["ingredient1", "ingredient2"],
      instructions: ["Step 1", "Step 2"]
    };
    const res = await request(app)
      .post("/recipes/create")
      .send(newRecipe)
      .set("Accept", "application/json");
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(300);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(newRecipe.title);
  });
});
