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
exports.registerUser = exports.getAllUsersExceptLoggedIn = exports.updateUserRole = exports.loginUser = void 0;
const asyncHandeller_1 = require("../utils/asyncHandeller");
const ApiError_1 = require("../utils/ApiError");
const user_model_1 = __importDefault(require("../model/user.model"));
const ApiResponse_1 = require("../utils/ApiResponse");
const registerUser = (0, asyncHandeller_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, photoUrl } = req.body;
    // Validate required fields
    if ([name, email, password, photoUrl].some((field) => !field || field.trim() === "")) {
        throw new ApiError_1.ApiError(400, "All required fields are mandatory!");
    }
    // Check if the user already exists
    const existedUser = yield user_model_1.default.findOne({ email });
    if (existedUser) {
        throw new ApiError_1.ApiError(409, "User already exists! Please use a different email.");
    }
    // Save photo temporarily and upload to cloud
    // Clean up temporary file after successful upload
    // Create the user
    const user = yield user_model_1.default.create({
        name,
        email,
        password,
        photoUrl
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
    // Check for missing email or password
    if (!email) {
        throw new ApiError_1.ApiError(400, "Email is required to login!");
    }
    if (!password) {
        throw new ApiError_1.ApiError(400, "Password is required to login!");
    }
    // Find the user with the provided email
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(401, "User not found. Please register to login!");
    }
    // Verify the password
    const isPasswordValid = yield user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, "Invalid password. Please try again!");
    }
    // Exclude the password from the response
    const _a = user.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, userWithoutPassword, "User logged in successfully!"));
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
