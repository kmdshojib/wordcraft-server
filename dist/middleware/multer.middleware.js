"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadMiddleware = void 0;
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Middleware for handling file uploads
exports.fileUploadMiddleware = (0, express_fileupload_1.default)({
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10 MB
    useTempFiles: true, // Use temporary files
    tempFileDir: "./public/temp", // Directory for temporary files
    createParentPath: true, // Create directories if not present
});
