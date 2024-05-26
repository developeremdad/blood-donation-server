"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createRequestIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.donorId,
        },
    });
    if (!donor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid donor id");
    }
    const createRequest = yield prisma_1.default.request.create({
        data: payload,
    });
    // Find the new created request
    const request = yield prisma_1.default.request.findUniqueOrThrow({
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
    const formattedRequest = request;
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
});
const getMyDonationRequestFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield prisma_1.default.request.findMany({
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
});
const getMyDonationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const donors = yield prisma_1.default.request.findMany({
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
});
const updateRequestStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield prisma_1.default.request.update({
        where: {
            id: id,
        },
        data: {
            requestStatus: payload.status,
        },
    });
    return request;
});
exports.requestServices = {
    createRequestIntoDB,
    getMyDonationRequestFromDB,
    getMyDonationFromDB,
    updateRequestStatusIntoDB,
};
