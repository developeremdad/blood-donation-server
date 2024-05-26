import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination.type";
import { calculatePagination } from "../../utils/calculatePagination";
import { IUserFilterRequest } from "./user.interface";

interface UserWithOptionalPassword extends Omit<User, "password"> {
  password?: string;
}
const registerUserIntoDB = async (payload: any) => {
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    bloodType: payload.bloodType,
    location: payload.location,
    availability: false,
    contact: payload.contact,
    photo: payload.photo,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const userProfileData = {
      userId: user.id,
      age: payload.age,
      bio: payload.bio,
      lastDonationDate: payload.lastDonationDate,
    };

    const profile = await transactionClient.userProfile.create({
      data: userProfileData,
    });

    return profile;
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: result.userId,
    },
    include: { userProfile: true },
  });

  const userWithOptionalPassword = user as UserWithOptionalPassword;
  delete userWithOptionalPassword.password;

  return user;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      status: true,
      availability: true,
      role: true,
      contact: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllDonorFromDB = async (
  params: IUserFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = params;

  const availability = filterData?.availability;
  if (availability === "false" || availability === "true") {
    const newAvailability = availability == "true" ? true : false;
    filterData.availability = newAvailability;
  }

  const andCondition: Prisma.UserWhereInput[] = [];

  // Handle searching
  if (params.searchTerm) {
    andCondition.push({
      OR: ["name", "email", "location", "bloodType"].map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle filtering
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Handle where condition
  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };

  // Handle pagination and final result
  const result = await prisma.user.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      status: true,
      availability: true,
      role: true,
      contact: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      userProfile: {
        select: {
          id: true,
          userId: true,
          bio: true,
          age: true,
          lastDonationDate: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      userProfile:
        paginationOptions.sortBy && paginationOptions.sortOrder
          ? {
              [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
          : {
              createdAt: "desc",
            },
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getMyProfileFromDB = async (id: string) => {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      role: true,
      contact: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return userProfile;
};

const getUserDetailsFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      role: true,
      contact: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });
  return user;
};

const updateMyProfileIntoDB = async (id: string, payload: any) => {
  const userProfileData = payload.userProfile;
  delete payload.userProfile;

  const userData = payload;

  // update user data
  const result = await prisma.$transaction(async (transactionClient: any) => {
    // Update user data
    const updatedUser = await transactionClient.user.update({
      where: { id },
      data: userData,
    });

    // Update user profile data
    const updatedUserProfile = await transactionClient.userProfile.update({
      where: { userId: id },
      data: userProfileData,
    });

    return { updatedUser, updatedUserProfile };
  });

  // Fetch and return the updated user including the profile
  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: { userProfile: true },
  });

  const userWithOptionalPassword = updatedUser as UserWithOptionalPassword;
  delete userWithOptionalPassword.password;

  return userWithOptionalPassword;
};

const updateUserRoleStatusIntoDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};

export const userService = {
  registerUserIntoDB,
  getAllUsersFromDB,
  getAllDonorFromDB,
  getMyProfileFromDB,
  getUserDetailsFromDB,
  updateMyProfileIntoDB,
  updateUserRoleStatusIntoDB,
};
