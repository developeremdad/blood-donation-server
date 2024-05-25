import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.loginUser),
  authController.loginUser
);

export const authRouters = router;
