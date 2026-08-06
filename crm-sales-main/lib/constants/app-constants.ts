import {
  TaskPriority,
  WorkLocation,
  ContractType,
  Gender,
  MaritalStatus,
  RoleLevel,
  EntityStatus,
  PermissionKey,
} from "./enum";

// ─── Select Option Helpers ────────────────────────────────────────────────────
// Pre-built option arrays for <Select> components — avoids re-declaring in every form.

export const TASK_PRIORITY_OPTIONS = [
  { value: TaskPriority.LOW, label: "Low" },
  { value: TaskPriority.MEDIUM, label: "Medium" },
  { value: TaskPriority.HIGH, label: "High" },
] as const;

export const WORK_LOCATION_OPTIONS = [
  { value: WorkLocation.ONSITE, label: "On-site" },
  { value: WorkLocation.REMOTE, label: "Remote" },
  { value: WorkLocation.HYBRID, label: "Hybrid" },
] as const;

export const CONTRACT_TYPE_OPTIONS = [
  { value: ContractType.FULL_TIME, label: "Full-time" },
  { value: ContractType.PART_TIME, label: "Part-time" },
  { value: ContractType.FREELANCE, label: "Freelance" },
  { value: ContractType.INTERNSHIP, label: "Internship" },
] as const;

export const GENDER_OPTIONS = [
  { value: Gender.MALE, label: "Male" },
  { value: Gender.FEMALE, label: "Female" },
  { value: Gender.OTHER, label: "Other" },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: MaritalStatus.SINGLE, label: "Single" },
  { value: MaritalStatus.MARRIED, label: "Married" },
  { value: MaritalStatus.DIVORCED, label: "Divorced" },
  { value: MaritalStatus.WIDOWED, label: "Widowed" },
] as const;

export const ROLE_LEVEL_OPTIONS = [
  { value: RoleLevel.ONE, label: "Level 1" },
  { value: RoleLevel.TWO, label: "Level 2" },
  { value: RoleLevel.THREE, label: "Level 3" },
  { value: RoleLevel.FOUR, label: "Level 4" },
  { value: RoleLevel.FIVE, label: "Level 5" },
] as const;

export const ENTITY_STATUS_OPTIONS = [
  { value: EntityStatus.ACTIVE, label: "Active" },
  { value: EntityStatus.INACTIVE, label: "Inactive" },
  { value: EntityStatus.PENDING, label: "Pending" },
] as const;

// ─── Permission Labels ────────────────────────────────────────────────────────
// Human-readable labels for each permission key, used in the roles UI.

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  [PermissionKey.CREATE_USERS]: "Create Users",
  [PermissionKey.EDIT_USERS]: "Edit Users",
  [PermissionKey.DELETE_USERS]: "Delete Users",
  [PermissionKey.MANAGE_ROLES]: "Manage Roles",
  [PermissionKey.VIEW_REPORTS]: "View Reports",
  [PermissionKey.DOWNLOAD_REPORTS]: "Download Reports",
  [PermissionKey.SET_TASKS]: "Set Tasks",
  [PermissionKey.VIEW_TASKS]: "View Tasks",
  [PermissionKey.SYSTEM_SETTINGS]: "System Settings",
  [PermissionKey.MANAGE_DEPARTMENTS]: "Manage Departments",
  [PermissionKey.VIEW_SALARY]: "View Salary",
  [PermissionKey.EDIT_SALARY]: "Edit Salary",
  [PermissionKey.CHATS_ARCHIVE]: "Chats Archive",
  [PermissionKey.TASKS_ARCHIVE]: "Tasks Archive",
  [PermissionKey.MANAGE_DOCUMENTS]: "Manage Documents",
};

// ─── Timing & Limits ──────────────────────────────────────────────────────────

export const DEBOUNCE_DELAY_MS = 300;
export const PAGINATION_PAGE_SIZE = 20;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ─── LocalStorage Keys ────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
} as const;
