"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
exports.findOne = (collection, ...args) => util_1.promisify(collection.findOne).apply(collection, args);
exports.insertOne = (collection, ...args) => util_1.promisify(collection.insertOne).apply(collection, args);
