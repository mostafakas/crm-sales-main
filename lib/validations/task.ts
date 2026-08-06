import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"], {
    error: "Please select a priority",
  }),
  weight: z.enum(["minor", "average", "normal", "master"]).optional(),
  project: z
    .enum([
      "diyar-platform",
      "maiyah-app",
      "kim-alzaem",
      "mobsoft-app",
    ])
    .optional(),
  department: z
    .enum([
      "content-writing",
      "programming",
      "design",
      "artificial-intelligence",
      "marketing",
      "finance",
    ])
    .optional(),
  cost: z.string().optional(),
  costFreelancer: z.boolean().optional(),
  dueDate: z.date({
    error: "A due date is required",
  }),
  assignees: z.array(z.string()).min(1, "Select at least one assignee"),
  attachments: z.array(z.any()).optional(),
});

export type TaskValues = z.infer<typeof taskSchema>;

export const taskFilterSchema = z.object({
  assigner: z.string().optional(),
  assignee: z.string().optional(),
  date: z.date().optional(),
  status: z.array(z.string()).optional(),
  weight: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
  departments: z.array(z.string()).optional(),
});

export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
