import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { promises as fs } from "fs";
import dotenv from "dotenv";
dotenv.config()
// Configure Cloudinary

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    throw new Error("Cloudinary credentials are missing in the environment.");
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


// const uploadOnCloud = async (filePath: string): Promise<UploadApiResponse | null> => {
//     try {
//         if (!filePath) {
//             console.error("File path is missing!");
//             return null;
//         }

//         // Upload to Cloudinary
//         const res: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
//             resource_type: "auto",
//             folder: "user_uploads", // Optional: Specify folder
//             use_filename: true,    // Use the original file name
//             unique_filename: false // Avoid unique names for simplicity
//         });

//         // Delete the local file after uploading
//         await fs.unlink(filePath);
//         return res;
//     } catch (err) {
//         console.error("Error uploading file to Cloudinary:", err);

//         // Ensure the local file is removed even in case of an error
//         if (await fs.stat(filePath).catch(() => false)) {
//             await fs.unlink(filePath);
//         }
//         return null;
//     }
// };

const uploadOnCloud = async (filePath: string): Promise<UploadApiResponse | null> => {
    try {
        const res = await cloudinary.uploader.upload(filePath, {
            folder: "user_uploads",
        });
        await fs.unlink(filePath); // Clean up after upload
        return res;
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        if (await fs.stat(filePath).catch(() => false)) {
            await fs.unlink(filePath);
        }
        return null;
    }
};
// export const uploadImage = (fileBuffer: Buffer): Promise<string> => {
//     return new Promise<string>((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             { resource_type: "auto" },
//             (error: any, result: any) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(result.secure_url);
//                 }
//             }
//         ).end(fileBuffer);
//     });
// };
export const uploadImage = (fileBuffer: Buffer): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
}
// export const generateSignature = (req: Request, res: Response): void => {
//     try {
//         const timestamp = Math.round(new Date().getTime() / 1000); // Generate a UNIX timestamp

//         // Generate a signature using Cloudinary's utility function
//         const signature = cloudinary.v2.utils.api_sign_request(
//             {
//                 timestamp,
//                 folder: "user_uploads", // Optional: Specify a folder
//             },
//             CLOUD_API_SECRET
//         );

//         // Send the signature and timestamp as a response
//         res.status(200).json({ signature, timestamp });
//     } catch (error) {
//         console.error("Error generating signature:", error);

//         // Send an error response
//         res.status(500).json({ error: "Failed to generate signature" });
//     }
// };
export { uploadOnCloud };
