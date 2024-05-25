"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidation = void 0;
const zod_1 = require("zod");
const createRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        donorId: zod_1.z.string({ required_error: "Donor id is required" }),
        phoneNumber: zod_1.z.string({ required_error: "Phone number is required" }),
        dateOfDonation: zod_1.z.string({
            required_error: "Date of donation is required",
        }),
        hospitalName: zod_1.z.string({ required_error: "Hospital name is required" }),
        hospitalAddress: zod_1.z.string({
            required_error: "Hospital address is required",
        }),
        reason: zod_1.z.string({
            required_error: "Reason is required",
        }),
    }),
});
const requestStatus = ["PENDING", "APPROVE", "REJECT"];
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(requestStatus),
    }),
});
exports.requestValidation = { createRequestSchema, updateStatus };
