import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(60, "Name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description is too long"),
  color: z.string().min(1, "Please select a color"),
  iconFile: z.string().optional(),
  headIds: z
    .array(z.string())
    .min(1, "Select at least one department head"),
  employeeIds: z.array(z.string()).optional(),
});

export type DepartmentValues = z.infer<typeof departmentSchema>;
