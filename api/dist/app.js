"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const user_1 = __importDefault(require("./routes/user"));
const question_1 = __importDefault(require("./routes/question"));
const app = new koa_1.default();
app.use(koa_body_1.default());
app.use(quiz_1.default.routes());
app.use(user_1.default.routes());
app.use(question_1.default.routes());
exports.default = app;
