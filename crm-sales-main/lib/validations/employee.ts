import { z } from "zod";
import { emailSchema, phoneSchema, permissionsSchema } from "./common";

// ─────────────────────────────────────────────────────────────────────────────
// Personal Info Tab (Figma node 145:74193)
// ─────────────────────────────────────────────────────────────────────────────
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: emailSchema,
  phoneNumber: phoneSchema,
  countryCode: z.string().min(1, "Country code is required"),
  birthDate: z.date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  nationality: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  personalAddress: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Employment Info Tab (Figma node 145:73128)
// ─────────────────────────────────────────────────────────────────────────────
const employmentInfoSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  seniorityLevel: z.string().min(1, "Seniority level is required"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  joinDate: z.date().optional(),
  probationEndDate: z.date().optional(),
  workLocation: z.enum(["onsite", "remote", "hybrid"]).optional(),
  contractType: z.enum(["full-time", "part-time", "freelance", "internship"]).optional(),
  workingHoursFrom: z.string().optional(),
  workingHoursTo: z.string().optional(),
  permissions: permissionsSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Bank Info Tab (Figma node 145:70993)
// ─────────────────────────────────────────────────────────────────────────────
const bankInfoSchema = z.object({
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  accountHolderName: z.string().optional(),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
  currency: z.string().optional(),
  salary: z.string().optional(),
  salaryDay: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Document Identity Tab (Figma node 145:69596)
// ─────────────────────────────────────────────────────────────────────────────
const documentIdentitySchema = z.object({
  nationalIdNumber: z.string().optional(),
  nationalIdExpiry: z.date().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.date().optional(),
  drivingLicenseNumber: z.string().optional(),
  drivingLicenseExpiry: z.date().optional(),
  // File references (URLs after upload or File objects pre-upload)
  nationalIdFrontFile: z.string().optional(),
  nationalIdBackFile: z.string().optional(),
  passportFile: z.string().optional(),
  contractFile: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Composite Employee Schema (all 4 tabs merged)
// ─────────────────────────────────────────────────────────────────────────────
export const employeeSchema = personalInfoSchema
  .merge(employmentInfoSchema)
  .merge(bankInfoSchema)
  .merge(documentIdentitySchema);

export type EmployeeValues = z.infer<typeof employeeSchema>;

// Individual tab types for isolated form sections
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type EmploymentInfoValues = z.infer<typeof employmentInfoSchema>;
export type BankInfoValues = z.infer<typeof bankInfoSchema>;
export type DocumentIdentityValues = z.infer<typeof documentIdentitySchema>;
