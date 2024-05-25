import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { requestController } from "./request.controller";
import { requestValidation } from "./request.validation";

const router = express.Router();

router.post(
  "/donation-request",
  auth("USER"),
  validateRequest(requestValidation.createRequestSchema),
  requestController.createRequest
);

router.get(
  "/donation-request",
  auth("USER"),
  requestController.getMyDonationRequest
);

router.put(
  "/donation-request/:requestId",
  auth("USER"),
  // validateRequest(requestValidation.updateStatus),
  requestController.updateRequestStatus
);

export const requestRoutes = router;
