import { z } from "zod";

export const documentSchema = z.object({
  file: z.string().min(1, "Please upload a file"),
  name: z.string().min(1, "File name is required").max(100, "Name too long"),
  departmentFolder: z.string().min(1, "Please select a destination folder"),
});

export type DocumentValues = z.infer<typeof documentSchema>;
