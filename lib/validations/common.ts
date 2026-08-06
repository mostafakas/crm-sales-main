import { z } from "zod";
import { emailField, phoneField } from "./base";

export const phoneSchema = phoneField;
export const emailSchema = emailField;

// NOTE: we intentionally do NOT use `.default(false)` here. In Zod 4, fields
// with `.default()` are optional in the *input* type and required in the
// *output* type, which makes `z.infer<…>` (output) incompatible with what
// `useForm` infers for its values (input). The form already supplies the
// false defaults via `defaultValues`, so a plain `z.boolean()` is correct.
export const permissionsSchema = z.object({
  createUsers: z.boolean(),
  editUsers: z.boolean(),
  deleteUsers: z.boolean(),
  manageRoles: z.boolean(),
  viewReports: z.boolean(),
  downloadReports: z.boolean(),
  setTasks: z.boolean(),
  viewTasks: z.boolean(),
  systemSettings: z.boolean(),
  manageDepartments: z.boolean(),
  viewSalary: z.boolean(),
  editSalary: z.boolean(),
  chatsArchive: z.boolean(),
  tasksArchive: z.boolean(),
  manageDocuments: z.boolean(),
});

export type PermissionsValues = z.infer<typeof permissionsSchema>;
