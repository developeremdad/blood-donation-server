"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const request_controller_1 = require("./request.controller");
const request_validation_1 = require("./request.validation");
const router = express_1.default.Router();
router.post("/donation-request", (0, auth_1.default)("USER", "ADMIN"), (0, validateRequest_1.default)(request_validation_1.requestValidation.createRequestSchema), request_controller_1.requestController.createRequest);
router.get("/donation-request", (0, auth_1.default)("USER", "ADMIN"), request_controller_1.requestController.getMyDonationRequest);
router.get("/my-donations", (0, auth_1.default)("USER", "ADMIN"), request_controller_1.requestController.getMyDonation);
router.put("/donation-request/:requestId", (0, auth_1.default)("USER", "ADMIN"), 
// validateRequest(requestValidation.updateStatus),
request_controller_1.requestController.updateRequestStatus);
exports.requestRoutes = router;
