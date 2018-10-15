"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
mongodb_1.MongoClient.connect(config_1.default.mongoUrl, { useNewUrlParser: true }, (err, client) => {
    if (err)
        throw err;
    const db = client.db(config_1.default.dbName);
    app_1.default.context = Object.create(app_1.default.context, { db: { value: db } });
    app_1.default.listen(3000, () => {
        console.log('listening on port ' + 3000); // eslint-disable-line no-console
    });
});
process.on('unhandledRejection', error => {
    console.log({ message: 'API unhandledRejection error', data: {}, error });
});
process.on('uncaughtException', error => {
    console.log({ message: 'API uncaughtException error', data: {}, error });
});
