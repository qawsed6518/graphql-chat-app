"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    channels: [String],
    image: {
        type: String,
        default: "profilePicture",
    },
});
const Usermodel = mongoose_1.default.model("User", UserSchema);
exports.default = Usermodel;
//# sourceMappingURL=user.js.map