import { app } from "./app";
// import connectDB from "./db/db";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

const port: any = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App listening on ${port}`);
})
// connectDB()
//     .then(() => {
//         app.listen(port, () => {
//             console.log(`App listening on ${port}`);
//         })
//     })
//     .catch((error) => console.error("Db error: " + error))