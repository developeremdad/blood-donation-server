import { z } from "zod";

const createRequestSchema = z.object({
  body: z.object({
    donorId: z.string({ required_error: "Donor id is required" }),
    phoneNumber: z.string({ required_error: "Phone number is required" }),
    dateOfDonation: z.string({
      required_error: "Date of donation is required",
    }),
    hospitalName: z.string({ required_error: "Hospital name is required" }),
    hospitalAddress: z.string({
      required_error: "Hospital address is required",
    }),
    reason: z.string({
      required_error: "Reason is required",
    }),
  }),
});

const requestStatus = ["PENDING", "APPROVE", "REJECT"];

const updateStatus = z.object({
  body: z.object({
    status: z.enum(requestStatus as [string, ...string[]]),
  }),
});

export const requestValidation = { createRequestSchema, updateStatus };
