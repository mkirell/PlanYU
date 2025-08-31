import { z } from 'zod';
import Task from '../models/task.model.js';
import { asyncHandler } from '../utils/asynchandler.js';

const taskCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  done: z.boolean().optional()
});

const taskUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  done: z.boolean().optional()
});

export const getAll = asyncHandler(async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 }).lean();
  res.json(tasks);
});

export const get = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).lean();
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

export const add = asyncHandler(async (req, res) => {
  const parsed = taskCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const created = await Task.create(parsed.data);
  res.status(201).json(created);
});

export const update = asyncHandler(async (req, res) => {
  const parsed = taskUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const updated = await Task.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true
  });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

export const remove = asyncHandler(async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true, deletedId: req.params.id });
});

export const removeAll = asyncHandler(async (_req, res) => {
  const result = await Task.deleteMany({});
  res.json({ ok: true, deletedCount: result.deletedCount });
});
