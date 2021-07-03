import mongoose from "mongoose";
const { Schema } = mongoose;

const message = {
    text: String,
    user: String,
    date: String,
    autoIndexId: false,
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
