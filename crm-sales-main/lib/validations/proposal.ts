import { z } from "zod";

export const proposalSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  service: z.enum([
    "content-writing",
    "programming",
    "design",
    "artificial-intelligence",
    "marketing",
    "finance",
  ], { error: "Select a service" }),
  clientName: z.string().min(1, "Client name is required"),
  market: z.enum(["saudi", "egypt", "global"], {
    error: "Select a market",
  }),
  language: z.enum(["english", "arabic", "both"], {
    error: "Select a language",
  }),
  format: z.enum(["docx", "pptx", "pdf"], {
    error: "Select a format",
  }),
  pages: z
    .number({ error: "Pages must be a number" })
    .int()
    .min(1, "At least one page"),
  expiresAt: z.date({ error: "Pick an expiry date" }),
  attachments: z.array(z.any()).optional(),
});

export type ProposalValues = z.infer<typeof proposalSchema>;

export const proposalFilterSchema = z.object({
  client: z.string().optional(),
  markets: z.array(z.enum(["saudi", "egypt", "global"])).optional(),
  services: z
    .array(
      z.enum([
        "content-writing",
        "programming",
        "design",
        "artificial-intelligence",
        "marketing",
        "finance",
      ]),
    )
    .optional(),
  languages: z.array(z.enum(["english", "arabic", "both"])).optional(),
  formats: z.array(z.enum(["docx", "pptx", "pdf"])).optional(),
  status: z.array(z.enum(["drafted", "active", "expired"])).optional(),
  createdAt: z.date().optional(),
  expiresAt: z.date().optional(),
});

export type ProposalFilterValues = z.infer<typeof proposalFilterSchema>;
