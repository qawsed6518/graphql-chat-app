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
        @Root() { text, user, date }: MessagePayload,
        @Args() { channelName }: NewMessageArgs
    ): Message {
        channelName;
        return { text, user, date };
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
            const createAt = new Date().toUTCString();
            channel.messages.push({
                text: input.text,
                user: req.session.name,
                date: createAt,
            });
            channel.save();

            // here we can trigger subscriptions topics
            const payload: MessagePayload = {
                text: input.text,
                user: req.session.name,
                date: createAt,
                channelName: input.channelName,
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
