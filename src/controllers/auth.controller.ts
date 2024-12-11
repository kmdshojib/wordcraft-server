import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandeller";
import { ApiError } from "../utils/ApiError";
import User from "../model/user.model";
import { uploadOnCloud } from "../utils/cloudenery";
import { ApiResponse } from "../utils/ApiResponse";

const resgisterUser = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.files);
    const { name, email, password } = req.body;

    // Validate required fields
    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields are required!");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User already exists! Please use a different email.");
    }

    // Validate and upload the photo
    const photoFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).photo?.[0];
    // const photoFile = photo[0]
    console.log(req.files)
    // console.log(photo[0])
    if (!photoFile) {
        throw new ApiError(400, "Photo is required!");
    }
    const photoLocaPath = photoFile.path;
    const photoUrl = await uploadOnCloud(photoLocaPath);

    if (!photoUrl) {
        throw new ApiError(500, "Failed to upload photo to cloud storage.");
    }
    // Create the user
    const user = await User.create({
        name,
        email,
        password,
        photoUrl: photoUrl.secure_url,
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
export { resgisterUser, loginUser };
