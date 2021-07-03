"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const MessageSchema = new Schema({
    text: {
        type: String,
    },
    user: {
        type: mongodb_1.ObjectId,
    },
    channel: {
        type: mongodb_1.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Messagemodel = mongoose_1.default.model("Message", MessageSchema);
exports.default = Messagemodel;
//# sourceMappingURL=message.js.map