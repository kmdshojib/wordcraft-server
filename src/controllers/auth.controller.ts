import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandeller";
import { ApiError } from "../utils/ApiError";
import User from "../model/user.model";
import { uploadOnCloud } from "../utils/cloudenery";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs/promises";
import path from "path";
import { UploadedFile } from "express-fileupload";
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All required fields are mandatory!");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User already exists! Please use a different email.");
    }

    // Validate and upload the photo
    if (!req.files || !req.files.photo) {
        throw new ApiError(400, "Photo is required!");
    }

    const photoFile = req.files.photo as UploadedFile;

    // Validate photo type and size
    if (!photoFile.mimetype.startsWith("image/")) {
        throw new ApiError(400, "Invalid file type. Only images are allowed.");
    }
    if (photoFile.size > 5 * 1024 * 1024) { // 5 MB limit
        throw new ApiError(400, "Photo size exceeds the 5 MB limit.");
    }

    // Save photo temporarily and upload to cloud
    const tempFilePath = path.join(__dirname, "../../public/temp", photoFile.name);
    await photoFile.mv(tempFilePath); // Move file to temporary directory

    const photoUrl = await uploadOnCloud(tempFilePath); // Cloud upload utility
    if (!photoUrl) {
        // Clean up temporary file
        await fs.unlink(tempFilePath);
        throw new ApiError(500, "Failed to upload photo to cloud storage.");
    }

    // Clean up temporary file after successful upload

    // Create the user
    const user = await User.create({
        name,
        email,
        password,
        photoUrl: photoUrl.secure_url, // URL from cloud storage
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

    if (!email) {
        throw new ApiError(400, "Email Required to Login!")
    }
    if (!password) {
        throw new ApiError(400, "Password Required to Login!")
    }
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
        throw new ApiError(401, "User not found Please Register to login!")
    }
    return res.json(
        new ApiResponse(200, user, "User logged in successfully!")
    )
})
export { registerUser, loginUser };
