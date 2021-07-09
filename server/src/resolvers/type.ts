import { Field, ObjectType, InputType, ArgsType } from "type-graphql";
import { Stream } from "stream";

@ObjectType()
export class Channel {
    @Field()
    name: string;
    @Field()
    owner: string;
    @Field()
    public: boolean;
    @Field(() => [String])
    members: string[];
}

@ObjectType()
export class Message {
    @Field()
    _id: string;
    @Field()
    user?: string;
    @Field({ nullable: true })
    text?: string;
    @Field({ nullable: true })
    image?: string;
    @Field()
    date: string;
}

@ObjectType()
export class User {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    createdAt: Date;
    @Field(() => [String], { nullable: true })
    channels: string[];
}

@ObjectType()
export class ChannelError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class MeResponse {
    @Field(() => Boolean, { nullable: true })
    loggedIn?: Boolean;

    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class ChannelResponse {
    @Field(() => ChannelError, { nullable: true })
    errors?: ChannelError;

    @Field(() => Channel, { nullable: true })
    channel?: Channel;
}

@InputType()
export class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@InputType()
export class MessageInput {
    @Field()
    channelName: string;
    @Field({ nullable: true })
    text?: string;
}

@ArgsType()
export class NewMessageArgs {
    @Field()
    channelName: string;
}

export interface MessagePayload {
    _id: string;
    text?: string;
    image?: string;
    user?: string;
    date: string;
    channelName?: string | String;
}

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}

export interface FileInput {
    picture: Upload;
    channelName: string;
}
