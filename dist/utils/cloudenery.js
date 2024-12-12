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
exports.uploadOnCloud = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = require("fs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    throw new Error("Cloudinary credentials are missing in the environment.");
}
cloudinary_1.v2.config({
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
const uploadOnCloud = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield cloudinary_1.v2.uploader.upload(filePath, {
            folder: "user_uploads",
        });
        yield fs_1.promises.unlink(filePath); // Clean up after upload
        return res;
    }
    catch (err) {
        console.error("Cloudinary upload failed:", err);
        if (yield fs_1.promises.stat(filePath).catch(() => false)) {
            yield fs_1.promises.unlink(filePath);
        }
        return null;
    }
});
exports.uploadOnCloud = uploadOnCloud;
