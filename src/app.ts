import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import { fileUploadMiddleware } from './middleware/multer.middleware';
const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser());
app.use(fileUploadMiddleware)
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

import userRouter from "./routes/auth.routes"
import lessonRouter from "./routes/lesson.routes"
// routes declarations
app.use("/api/users", userRouter);
app.use("/api/lessons", lessonRouter);
export { app }