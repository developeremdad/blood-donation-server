import { Request, RequestStatusEnum, User } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

// Extend interface for make optional filed
interface UserWithOptionalPassword extends Omit<User, "password"> {
  password?: string;
}

interface RequestWithOptional extends Omit<Request, "requesterId"> {
  requesterId?: string;
  donor: UserWithOptionalPassword;
}

const createRequestIntoDB = async (payload: any) => {
  const donor = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.donorId,
    },
  });

  if (!donor) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid donor id");
  }
  const createRequest = await prisma.request.create({
    data: payload,
  });

  // Find the new created request
  const request = await prisma.request.findUniqueOrThrow({
    where: {
      id: createRequest.id,
    },
    include: {
      donor: {
        include: {
          userProfile: true,
        },
      },
    },
  });

  const formattedRequest = request as RequestWithOptional;

  delete formattedRequest.requesterId;

  // Check if the donor field exists and delete password from it
  if (formattedRequest.donor && formattedRequest.donor.password) {
    delete formattedRequest.donor.password;
  }

  // Check if donor and userProfile exist, then delete password from userProfile
  if (formattedRequest.donor && formattedRequest.donor) {
    delete formattedRequest.donor.password;
  }

  return formattedRequest;
};

const getMyDonationRequestFromDB = async (id: string) => {
  const request = await prisma.request.findMany({
    where: {
      donorId: id,
    },
    select: {
      id: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      donor: {
        select: {
          bloodType: true,
        },
      },
      requester: {
        select: {
          id: true,
          name: true,
          contact: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
        },
      },
    },
  });

  return request;
};

const getMyDonationFromDB = async (id: string) => {
  const donors = await prisma.request.findMany({
    where: {
      requesterId: id,
    },
    select: {
      id: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      donor: {
        select: {
          id: true,
          name: true,
          contact: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
        },
      },
    },
  });

  return donors;
};

const updateRequestStatusIntoDB = async (
  id: string,
  payload: { status: string }
) => {
  const request = await prisma.request.update({
    where: {
      id: id,
    },
    data: {
      requestStatus: payload.status as RequestStatusEnum,
    },
  });

  return request;
};

export const requestServices = {
  createRequestIntoDB,
  getMyDonationRequestFromDB,
  getMyDonationFromDB,
  updateRequestStatusIntoDB,
};
