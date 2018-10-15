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
const uuid_1 = __importDefault(require("uuid"));
const mongo_1 = require("../helpers/mongo");
const router = new koa_router_1.default({ prefix: '/api/v1' });
router.post('/question', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const { imgUrl, text, answers, correctAnswers } = ctx.request.body;
    if (!imgUrl || !text || !answers || !correctAnswers) {
        return ctx.throw(400);
    }
    const questions = ctx.db.collection('questions');
    const id = uuid_1.default();
    yield mongo_1.insertOne(questions, {
        _id: id,
        imgUrl,
        text,
        answers,
        correctAnswers
    });
    ctx.status = 201;
    ctx.response.body = {
        id,
        imgUrl,
        text,
        answers,
        correctAnswers
    };
}));
exports.default = router;
