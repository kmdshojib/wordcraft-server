import mongoose from "mongoose";
import { DB_NAME } from "../constants";

let mongoDBUrl: string;
if (process.env.NODE_ENV === 'production') {
    mongoDBUrl = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.ygyoxnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    // mongoDBUrl = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.ygyoxnw.mongodb.net/wordcraft`
} else {
    mongoDBUrl = `mongodb://localhost:27017/${DB_NAME}`
}
const connectDB = async () => {
    try {
        const connectionIstance = await mongoose.connect(mongoDBUrl)
        console.log(`DB connection established: ${connectionIstance.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;