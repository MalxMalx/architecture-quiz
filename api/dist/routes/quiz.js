"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const mongo_1 = require("../helpers/mongo");
const router = new koa_router_1.default({ prefix: '/api/v1' });
router.post('/start-quiz', (ctx) => __awaiter(this, void 0, void 0, function* () {
    // Start a quiz
    const { userId } = ctx.request.body;
    if (!userId) {
        return ctx.throw(400, 'userId required');
    }
    // check if userId exists
    const users = ctx.db.collection('users');
    const user = yield mongo_1.findOne(users, { userId });
    if (!user) {
        return ctx.throw(404, 'user not found');
    }
    // create a user-quiz entry
    const userQuiz = ctx.db.collection('user-quiz');
    yield mongo_1.insertOne(userQuiz, { userId, currentQuestionIndex: 0, score: 0 });
    // return the first question inside body
    const questions = ctx.db.collection('questions');
    const question = yield mongo_1.findOne(questions, {});
    if (!question) {
        throw new Error('No questions!');
    }
    ctx.response.body = { question };
}));
exports.default = router;
