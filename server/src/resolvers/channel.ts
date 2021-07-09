import { isAuth } from "../middleware/isAuth";
import { PubSubEngine } from "graphql-subscriptions";
import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
    Subscription,
    Root,
    ResolverFilterData,
    Args,
    PubSub,
} from "type-graphql";
import { MyContext } from "../types";
import Channelmodel from "../models/channel";
import Usermodel from "../models/user";
import {
    Channel,
    Message,
    MessageInput,
    ChannelResponse,
    NewMessageArgs,
    MessagePayload,
} from "./type";
import { createWriteStream } from "fs";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import path from "path";

@Resolver(Channel)
export class ChannelResolver {
    @Subscription({
        topics: ["MESSAGES"],
        filter: ({
            payload,
            args,
        }: ResolverFilterData<MessagePayload, NewMessageArgs>) =>
            payload.channelName === args.channelName,
    })
    newMessage(
        @Root() { _id, text, user, date, image }: MessagePayload,
        @Args() { channelName }: NewMessageArgs
    ): Message {
        channelName;
        return { _id, text, user, date, image };
    }

    ///////////////////////////////////////////////////

    @Query(() => [Channel], { nullable: true })
    @UseMiddleware(isAuth)
    allChannel(): Promise<Channel[]> {
        return Channelmodel.find();
    }

    @Query(() => [Message])
    @UseMiddleware(isAuth)
    async messages(@Arg("channelName") channelName: String) {
        const channel = await Channelmodel.findOne({
            name: channelName,
        });
        const messages: Array<Message> = channel.messages;

        return messages;
    }

    //////////////////////////////////////////////////
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async findChannel(
        @Arg("channelNameInput") channelNameInput: String,
        @Ctx() { req }: MyContext
    ): Promise<Boolean> {
        const channel = await Channelmodel.findOne({
            name: channelNameInput,
        });

        if (channel == null) return false;

        const user = await Usermodel.findOne({
            username: req.session.name,
        });

        if (user.channels.includes(channelNameInput) == true) {
            return true;
        } else {
            await user.channels.push(channelNameInput);
            await channel.members.push(req.session.name);
            user.save();
            channel.save();
            return true;
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async createMessage(
        @Arg("input") input: MessageInput,
        @Ctx() { req }: MyContext,
        @PubSub() pubsub: PubSubEngine
    ): Promise<Boolean> {
        try {
            const channel = await Channelmodel.findOne({
                name: input.channelName,
            });
            const UTC = new Date().toUTCString();
            const msg = channel.messages.addToSet({
                text: input.text,
                user: req.session.name,
                date: UTC,
            });
            channel.save();

            const payload: MessagePayload = {
                _id: msg[0]._id,
                user: msg[0].user,
                date: msg[0].date,
                channelName: input.channelName,
                text: msg[0].text,
            };

            await pubsub.publish("MESSAGES", payload);

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /////////////////////////////////////////////////////////////

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async createFile(
        @Arg("file", () => GraphQLUpload) file: FileUpload,
        @Arg("channelName") channelName: String,
        @Ctx() { req }: MyContext,
        @PubSub() pubsub: PubSubEngine
    ) {
        try {
            const channel = await Channelmodel.findOne({
                name: channelName,
            });
            const { createReadStream, filename } = await file;
            const UTC = new Date().toUTCString();

            await new Promise((res) =>
                createReadStream()
                    .pipe(
                        createWriteStream(
                            path.join(__dirname, `/../../images`, filename)
                        )
                    )
                    .on("close", res)
            );

            const msg = channel.messages.addToSet({
                image: filename,
                user: req.session.name,
                date: UTC,
            });
            channel.save();

            const payload: MessagePayload = {
                _id: msg[0]._id,
                user: msg[0].user,
                date: msg[0].date,
                channelName: channelName,
                image: msg[0].image,
            };

            await pubsub.publish("MESSAGES", payload);

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    /////////////////////////////////////////////////////////////

    @Mutation(() => ChannelResponse)
    @UseMiddleware(isAuth)
    async createChannel(
        @Arg("input") input: String,
        @Ctx() { req }: MyContext
    ): Promise<ChannelResponse> {
        try {
            let channel = await Channelmodel.findOne({
                name: input,
            });
            if (channel == null) {
                channel = new Channelmodel({
                    name: input,
                    owner: req.session.name,
                    members: [req.session.name],
                });
            } else {
                return {
                    errors: {
                        field: "name",
                        message: "이미 있는 name",
                    },
                };
            }
            const result = await channel.save();

            const user = await Usermodel.findOne({
                username: req.session.name,
            });
            user.channels.push(input);
            user.save();

            return {
                channel: {
                    name: result.name,
                    public: true,
                    owner: result.owner,
                    members: [result.owner],
                },
            };
        } catch (err) {
            return {
                errors: {
                    field: "create channel",
                    message: err,
                },
            };
        }
    }
}
