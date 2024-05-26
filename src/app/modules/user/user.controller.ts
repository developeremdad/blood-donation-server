import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pickValidFields from "../../../shared/pickValidFields";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";

const registerUser = catchAsync(async (req, res) => {
  const result = await userService.registerUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const user = req.user;
  req.body.requesterId = user.id;
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieve successfully",
    data: result,
  });
});

const getAllDonor = catchAsync(async (req, res) => {
  if (["A ", "B ", "AB ", "O "].includes(req?.query?.bloodType as string)) {
    const bloodType = `${req?.query?.bloodType}+`;
    req.query.bloodType = bloodType.replace(/\s+/g, "");
  }

  if (["A ", "B ", "AB ", "O "].includes(req?.query?.searchTerm as string)) {
    const search = `${req?.query?.searchTerm}+`;
    req.query.searchTerm = search.replace(/\s+/g, "");
  }

  const filters = pickValidFields(req.query, [
    "name",
    "age",
    "status",
    "role",
    "searchTerm",
    "lastDonationDate",
    "availability",
    "bloodType",
  ]);
  const paginationOptions = pickValidFields(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await userService.getAllDonorFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donors successfully found",
    meta: result?.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const result = await userService.getMyProfileFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const getUserDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.getUserDetailsFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User details retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const result = await userService.updateMyProfileIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateUserRoleStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.updateUserRoleStatusIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await userService.changePassword(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const userController = {
  registerUser,
  getAllUsers,
  getAllDonor,
  getMyProfile,
  getUserDetails,
  updateMyProfile,
  updateUserRoleStatus,
  changePassword,
};
