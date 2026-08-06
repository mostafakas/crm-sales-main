// ─── Task Priority ────────────────────────────────────────────────────────────

export const TaskPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

// ─── Work Location ────────────────────────────────────────────────────────────

export const WorkLocation = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
} as const;
export type WorkLocation = (typeof WorkLocation)[keyof typeof WorkLocation];

// ─── Contract Type ────────────────────────────────────────────────────────────

export const ContractType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  FREELANCE: "freelance",
  INTERNSHIP: "internship",
} as const;
export type ContractType = (typeof ContractType)[keyof typeof ContractType];

// ─── Gender ───────────────────────────────────────────────────────────────────

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

// ─── Marital Status ───────────────────────────────────────────────────────────

export const MaritalStatus = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
} as const;
export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

// ─── Role Authority Level ─────────────────────────────────────────────────────

export const RoleLevel = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
} as const;
export type RoleLevel = (typeof RoleLevel)[keyof typeof RoleLevel];

// ─── Employee / Department Status ─────────────────────────────────────────────

export const EntityStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;
export type EntityStatus = (typeof EntityStatus)[keyof typeof EntityStatus];

// ─── Permission Keys ──────────────────────────────────────────────────────────

export const PermissionKey = {
  CREATE_USERS: "createUsers",
  EDIT_USERS: "editUsers",
  DELETE_USERS: "deleteUsers",
  MANAGE_ROLES: "manageRoles",
  VIEW_REPORTS: "viewReports",
  DOWNLOAD_REPORTS: "downloadReports",
  SET_TASKS: "setTasks",
  VIEW_TASKS: "viewTasks",
  SYSTEM_SETTINGS: "systemSettings",
  MANAGE_DEPARTMENTS: "manageDepartments",
  VIEW_SALARY: "viewSalary",
  EDIT_SALARY: "editSalary",
  CHATS_ARCHIVE: "chatsArchive",
  TASKS_ARCHIVE: "tasksArchive",
  MANAGE_DOCUMENTS: "manageDocuments",
} as const;
export type PermissionKey = (typeof PermissionKey)[keyof typeof PermissionKey];
