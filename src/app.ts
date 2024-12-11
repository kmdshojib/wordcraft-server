import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"))
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

import userRouter from "./routes/auth.routes"
// routes declarations
app.use("/api/users", userRouter);

export { app }