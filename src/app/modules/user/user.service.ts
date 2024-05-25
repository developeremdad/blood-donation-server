import { Prisma, User, UserProfile } from "@prisma/client";
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
      availability: true,
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

  return {
    meta: {
      page,
      limit,
      total,
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
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return userProfile;
};

const updateMyProfileIntoDB = async (
  id: string,
  payload: Partial<UserProfile>
) => {
  const profile = await prisma.userProfile.update({
    where: {
      userId: id,
    },
    data: payload,
  });

  return profile;
};

export const userService = {
  registerUserIntoDB,
  getAllDonorFromDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
};
