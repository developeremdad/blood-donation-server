"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const calculatePagination_1 = require("../../utils/calculatePagination");
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    const userData = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        bloodType: payload.bloodType,
        location: payload.location,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: userData,
        });
        const userProfileData = {
            userId: user.id,
            age: payload.age,
            bio: payload.bio,
            lastDonationDate: payload.lastDonationDate,
        };
        const profile = yield transactionClient.userProfile.create({
            data: userProfileData,
        });
        return profile;
    }));
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: result.userId,
        },
        include: { userProfile: true },
    });
    const userWithOptionalPassword = user;
    delete userWithOptionalPassword.password;
    return user;
});
const getAllDonorFromDB = (params, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = (0, calculatePagination_1.calculatePagination)(paginationOptions);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const availability = filterData === null || filterData === void 0 ? void 0 : filterData.availability;
    if (availability === "false" || availability === "true") {
        const newAvailability = availability == "true" ? true : false;
        filterData.availability = newAvailability;
    }
    const andCondition = [];
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
                    equals: filterData[key],
                },
            })),
        });
    }
    // Handle where condition
    const whereCondition = { AND: andCondition };
    // Handle pagination and final result
    const result = yield prisma_1.default.user.findMany({
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
            userProfile: paginationOptions.sortBy && paginationOptions.sortOrder
                ? {
                    [paginationOptions.sortBy]: paginationOptions.sortOrder,
                }
                : {
                    createdAt: "desc",
                },
        },
    });
    const total = yield prisma_1.default.user.count({
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
});
const getMyProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prisma_1.default.user.findUniqueOrThrow({
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
});
const updateMyProfileIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.userProfile.update({
        where: {
            userId: id,
        },
        data: payload,
    });
    return profile;
});
exports.userService = {
    registerUserIntoDB,
    getAllDonorFromDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB,
};
