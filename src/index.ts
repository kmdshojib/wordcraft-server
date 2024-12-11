import { app } from "./app";
import connectDB from "./db/db";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

const port: number | string = process.env.PORT || 5000
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`App listening on ${port}`);
        })
    })
    .catch((error) => console.error("Db error: " + error))