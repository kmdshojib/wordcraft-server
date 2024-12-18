import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandeller";
import { ApiError } from "../utils/ApiError";
import User from "../model/user.model";
import { uploadImage, uploadOnCloud } from "../utils/cloudenery";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs/promises";
import path from "path";
import { UploadedFile } from "express-fileupload";
import Busboy from "busboy";
import { v2 as cloudinary } from 'cloudinary';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, photoUrl } = req.body;

    // Validate required fields
    if ([name, email, password, photoUrl].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All required fields are mandatory!");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User already exists! Please use a different email.");
    }
    // Save photo temporarily and upload to cloud

    // Clean up temporary file after successful upload

    // Create the user
    const user = await User.create({
        name,
        email,
        password,
        photoUrl
    });

    // Fetch the created user without the password field
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating a new user!");
    }

    // Respond with the created user
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully!")
    );
});


const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check for missing email or password
    if (!email) {
        throw new ApiError(400, "Email is required to login!");
    }
    if (!password) {
        throw new ApiError(400, "Password is required to login!");
    }

    // Find the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not found. Please register to login!");
    }

    // Verify the password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password. Please try again!");
    }

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json(
        new ApiResponse(200, userWithoutPassword, "User logged in successfully!")
    );
});


const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { email, role } = req.body;

    // Validate input
    if (!email) {
        throw new ApiError(400, "Email is required to update role!");
    }
    if (!role) {
        throw new ApiError(400, "Role is required to update user!");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found!");
    }
    user.role = role;
    await user.save();

    return res.json(
        new ApiResponse(200, user, `User role successfully updated to ${user.role}!`)
    );
});
const getAllUsersExceptLoggedIn = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUserId = req.params.id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return res.json(
        new ApiResponse(200, users, "Fetched all users except the logged-in user successfully!")
    );
});

export { loginUser, updateUserRole, getAllUsersExceptLoggedIn, registerUser};
