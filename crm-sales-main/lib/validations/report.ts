import { z } from "zod";
import { dateRangeValid, requiredDate } from "./base";

export const reportSchema = dateRangeValid(
  z.object({
    employeeId: z.string().min(1, "Please select an employee"),
    fromDate: requiredDate("Start date"),
    toDate: requiredDate("End date"),
  }),
  "fromDate",
  "toDate"
);

export type ReportValues = z.infer<typeof reportSchema>;
