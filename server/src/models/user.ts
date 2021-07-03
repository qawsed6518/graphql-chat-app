import mongoose from "mongoose";
const { Schema } = mongoose;

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
});

const Usermodel = mongoose.model("User", UserSchema);
export default Usermodel;
