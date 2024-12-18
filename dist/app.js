"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_middleware_1 = require("./middleware/multer.middleware");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use(multer_middleware_1.fileUploadMiddleware);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const lesson_routes_1 = __importDefault(require("./routes/lesson.routes"));
// routes declarations
app.use("/api/users", auth_routes_1.default);
app.use("/api/lessons", lesson_routes_1.default);
