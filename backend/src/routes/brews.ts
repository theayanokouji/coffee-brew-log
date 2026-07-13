import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

export const brewsRouter = Router();

const BrewSchema = z.object({
  beans: z.string().trim().min(1, "beans is required"),
  method: z.string().trim().min(1, "method is required"),
  coffeeGrams: z.coerce.number().positive("coffeeGrams must be > 0"),
  waterGrams: z.coerce.number().positive("waterGrams must be > 0"),
  rating: z.coerce.number().int().min(0).max(5),
  tastingNotes: z.string().trim().min(1, "tastingNotes is required"),
});

// GET /api/brews?method=Aeropress
brewsRouter.get("/", async (req, res) => {
  const method = typeof req.query.method === "string" ? req.query.method : undefined;
  const brews = await prisma.brew.findMany({
    where: method ? { method } : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json(brews);
});

// GET /api/brews/:id
brewsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const brew = await prisma.brew.findUnique({ where: { id } });
  if (!brew) return res.status(404).json({ error: "Brew not found" });
  res.json(brew);
});

// POST /api/brews
brewsRouter.post("/", async (req, res) => {
  const parsed = BrewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const brew = await prisma.brew.create({ data: parsed.data });
  res.status(201).json(brew);
});

// PUT /api/brews/:id
brewsRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = BrewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const existing = await prisma.brew.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Brew not found" });
  const brew = await prisma.brew.update({ where: { id }, data: parsed.data });
  res.json(brew);
});

// DELETE /api/brews/:id
brewsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  const existing = await prisma.brew.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Brew not found" });
  await prisma.brew.delete({ where: { id } });
  res.status(204).send();
});