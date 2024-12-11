"use strict";
// import multer, { StorageEngine } from "multer";
// import { Request } from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadMiddleware = void 0;
// // Configure Multer storage
// const storage: StorageEngine = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/temp"); // Upload directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
//     }
// });
// // Create the upload instance
// export const upload = multer({ storage });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Middleware for handling file uploads
exports.fileUploadMiddleware = (0, express_fileupload_1.default)({
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10 MB
    useTempFiles: true, // Use temporary files
    tempFileDir: "./public/temp", // Directory for temporary files
    createParentPath: true, // Create directories if not present
});
