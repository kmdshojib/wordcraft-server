// import multer, { StorageEngine } from "multer";
// import { Request } from "express";

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
import fileUpload, { UploadedFile } from "express-fileupload";


// Middleware for handling file uploads
export const fileUploadMiddleware = fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10 MB
    useTempFiles: true, // Use temporary files
    tempFileDir: "./public/temp", // Directory for temporary files
    createParentPath: true, // Create directories if not present
});
