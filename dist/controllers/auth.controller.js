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
exports.getAllUsersExceptLoggedIn = exports.updateUserRole = exports.loginUser = exports.registerUser = void 0;
const asyncHandeller_1 = require("../utils/asyncHandeller");
const ApiError_1 = require("../utils/ApiError");
const user_model_1 = __importDefault(require("../model/user.model"));
const cloudenery_1 = require("../utils/cloudenery");
const ApiResponse_1 = require("../utils/ApiResponse");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const registerUser = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Validate required fields
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError_1.ApiError(400, "All required fields are mandatory!");
    }
    // Check if the user already exists
    const existedUser = yield user_model_1.default.findOne({ email });
    if (existedUser) {
        throw new ApiError_1.ApiError(409, "User already exists! Please use a different email.");
    }
    // Validate and upload the photo
    if (!req.files || !req.files.photo) {
        throw new ApiError_1.ApiError(400, "Photo is required!");
    }
    const photoFile = req.files.photo;
    // Validate photo type and size
    if (!photoFile.mimetype.startsWith("image/")) {
        throw new ApiError_1.ApiError(400, "Invalid file type. Only images are allowed.");
    }
    if (photoFile.size > 5 * 1024 * 1024) { // 5 MB limit
        throw new ApiError_1.ApiError(400, "Photo size exceeds the 5 MB limit.");
    }
    // Save photo temporarily and upload to cloud
    const tempFilePath = path_1.default.join(__dirname, "../../public/temp", photoFile.name);
    yield photoFile.mv(tempFilePath); // Move file to temporary directory
    const photoUrl = yield (0, cloudenery_1.uploadOnCloud)(tempFilePath); // Cloud upload utility
    if (!photoUrl) {
        // Clean up temporary file
        yield promises_1.default.unlink(tempFilePath);
        throw new ApiError_1.ApiError(500, "Failed to upload photo to cloud storage.");
    }
    // Clean up temporary file after successful upload
    // Create the user
    const user = yield user_model_1.default.create({
        name,
        email,
        password,
        photoUrl: photoUrl.secure_url, // URL from cloud storage
    });
    // Fetch the created user without the password field
    const createdUser = yield user_model_1.default.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError_1.ApiError(500, "Something went wrong while creating a new user!");
    }
    // Respond with the created user
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, createdUser, "User created successfully!"));
}));
exports.registerUser = registerUser;
const loginUser = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError_1.ApiError(400, "Email Required to Login!");
    }
    if (!password) {
        throw new ApiError_1.ApiError(400, "Password Required to Login!");
    }
    const user = yield user_model_1.default.findOne({ email }).select("-password");
    if (!user) {
        throw new ApiError_1.ApiError(401, "User not found Please Register to login!");
    }
    return res.json(new ApiResponse_1.ApiResponse(200, user, "User logged in successfully!"));
}));
exports.loginUser = loginUser;
const updateUserRole = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.body;
    // Validate input
    if (!email) {
        throw new ApiError_1.ApiError(400, "Email is required to update role!");
    }
    if (!role) {
        throw new ApiError_1.ApiError(400, "Role is required to update user!");
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found!");
    }
    user.role = role;
    yield user.save();
    return res.json(new ApiResponse_1.ApiResponse(200, user, `User role successfully updated to ${user.role}!`));
}));
exports.updateUserRole = updateUserRole;
const getAllUsersExceptLoggedIn = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.params.id;
    const users = yield user_model_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
    return res.json(new ApiResponse_1.ApiResponse(200, users, "Fetched all users except the logged-in user successfully!"));
}));
exports.getAllUsersExceptLoggedIn = getAllUsersExceptLoggedIn;
