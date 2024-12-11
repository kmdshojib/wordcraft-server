import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { promises as fs } from "fs";
import dotenv from "dotenv";
dotenv.config()
// Configure Cloudinary

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    throw new Error("Cloudinary credentials are missing in the environment.");
}
const CLOUD_NAME="dy85l0m09"
const CLOUD_API_KEY="567263917634274"
const CLOUD_API_SECRET="iOPbtw9XtrFwVxNEfWzuNGSl98A"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloud = async (filePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!filePath) {
            console.error("File path is missing!");
            return null;
        }

        // Upload to Cloudinary
        const res: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: "user_uploads", // Optional: Specify folder
            use_filename: true,    // Use the original file name
            unique_filename: false // Avoid unique names for simplicity
        });

        // Delete the local file after uploading
        await fs.unlink(filePath);
        return res;
    } catch (err) {
        console.error("Error uploading file to Cloudinary:", err);

        // Ensure the local file is removed even in case of an error
        if (await fs.stat(filePath).catch(() => false)) {
            await fs.unlink(filePath);
        }
        return null;
    }
};

export { uploadOnCloud };
