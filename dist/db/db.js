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
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
let mongoDBUrl;
if (process.env.NODE_ENV === 'production') {
    mongoDBUrl = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.ygyoxnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    // mongoDBUrl = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.ygyoxnw.mongodb.net/wordcraft`
}
else {
    mongoDBUrl = `mongodb://localhost:27017/${constants_1.DB_NAME}`;
}
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionIstance = yield mongoose_1.default.connect(mongoDBUrl);
        console.log(`DB connection established: ${connectionIstance.connection.host}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
exports.default = connectDB;
