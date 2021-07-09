"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewMessageArgs = exports.MessageInput = exports.UsernamePasswordInput = exports.ChannelResponse = exports.MeResponse = exports.UserResponse = exports.FieldError = exports.ChannelError = exports.User = exports.Message = exports.Channel = void 0;
const type_graphql_1 = require("type-graphql");
let Channel = class Channel {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Channel.prototype, "owner", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], Channel.prototype, "public", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", Array)
], Channel.prototype, "members", void 0);
Channel = __decorate([
    type_graphql_1.ObjectType()
], Channel);
exports.Channel = Channel;
let Message = class Message {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "date", void 0);
Message = __decorate([
    type_graphql_1.ObjectType()
], Message);
exports.Message = Message;
let User = class User {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "channels", void 0);
User = __decorate([
    type_graphql_1.ObjectType()
], User);
exports.User = User;
let ChannelError = class ChannelError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChannelError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ChannelError.prototype, "message", void 0);
ChannelError = __decorate([
    type_graphql_1.ObjectType()
], ChannelError);
exports.ChannelError = ChannelError;
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
exports.FieldError = FieldError;
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User, { nullable: true }),
    __metadata("design:type", User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
exports.UserResponse = UserResponse;
let MeResponse = class MeResponse {
};
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], MeResponse.prototype, "loggedIn", void 0);
__decorate([
    type_graphql_1.Field(() => User, { nullable: true }),
    __metadata("design:type", User)
], MeResponse.prototype, "user", void 0);
MeResponse = __decorate([
    type_graphql_1.ObjectType()
], MeResponse);
exports.MeResponse = MeResponse;
let ChannelResponse = class ChannelResponse {
};
__decorate([
    type_graphql_1.Field(() => ChannelError, { nullable: true }),
    __metadata("design:type", ChannelError)
], ChannelResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Channel, { nullable: true }),
    __metadata("design:type", Channel)
], ChannelResponse.prototype, "channel", void 0);
ChannelResponse = __decorate([
    type_graphql_1.ObjectType()
], ChannelResponse);
exports.ChannelResponse = ChannelResponse;
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
exports.UsernamePasswordInput = UsernamePasswordInput;
let MessageInput = class MessageInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "channelName", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], MessageInput.prototype, "text", void 0);
MessageInput = __decorate([
    type_graphql_1.InputType()
], MessageInput);
exports.MessageInput = MessageInput;
let NewMessageArgs = class NewMessageArgs {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], NewMessageArgs.prototype, "channelName", void 0);
NewMessageArgs = __decorate([
    type_graphql_1.ArgsType()
], NewMessageArgs);
exports.NewMessageArgs = NewMessageArgs;
//# sourceMappingURL=type.js.map