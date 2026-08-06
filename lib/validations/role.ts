import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name is too long"),
  level: z.enum(["1", "2", "3", "4", "5"], { error: "Authority level is required" }),
  permissions: z.object({
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
  }),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

export type Permissions = CreateRoleFormData["permissions"];
