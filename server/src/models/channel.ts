import mongoose from "mongoose";
const { Schema } = mongoose;

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

const Channelmodel = mongoose.model("Channel", ChannelSchema);
export default Channelmodel;
