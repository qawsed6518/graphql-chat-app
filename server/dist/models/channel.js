"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const message = {
    text: { type: String, nullable: true },
    image: { type: String, nullable: true },
    user: String,
    date: String,
};
const ChannelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: String,
        required: true,
    },
    members: [String],
    messages: [message],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Channelmodel = mongoose_1.default.model("Channel", ChannelSchema);
exports.default = Channelmodel;
//# sourceMappingURL=channel.js.map