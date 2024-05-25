import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { requestServices } from "./request.service";

const createRequest = catchAsync(async (req, res) => {
  const user = req.user;
  req.body.requesterId = user.id;
  const result = await requestServices.createRequestIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Request successfully made",
    data: result,
  });
});

const getMyDonationRequest = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await requestServices.getMyDonationRequestFromDB(user?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

const updateRequestStatus = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const result = await requestServices.updateRequestStatusIntoDB(
    requestId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation request status successfully updated",
    data: result,
  });
});

export const requestController = {
  createRequest,
  getMyDonationRequest,
  updateRequestStatus,
};
