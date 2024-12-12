
import fileUpload from "express-fileupload";
// Middleware for handling file uploads
export const fileUploadMiddleware = fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10 MB
    useTempFiles: true, // Use temporary files
    tempFileDir: "./public/temp", // Directory for temporary files
    createParentPath: true, // Create directories if not present
});
