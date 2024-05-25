import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { generateToken } from "../../utils/generateToken";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  const accessToken = await generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    token: accessToken,
  };
};

export const authServices = { loginUserFromDB };
