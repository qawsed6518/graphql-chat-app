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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const type_graphql_1 = require("type-graphql");
const channel_1 = __importDefault(require("../models/channel"));
const user_1 = __importDefault(require("../models/user"));
const type_1 = require("./type");
const fs_1 = require("fs");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
let ChannelResolver = class ChannelResolver {
    newMessage({ _id, text, user, date, image }, { channelName }) {
        channelName;
        return { _id, text, user, date, image };
    }
    allChannelMember(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = yield channel_1.default.findOne({
                name: channelName,
            });
            return ch.members;
        });
    }
    allChannel() {
        return channel_1.default.find();
    }
    messages(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield channel_1.default.findOne({
                name: channelName,
            });
            const messages = channel.messages;
            return messages;
        });
    }
    findChannel(channelNameInput, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield channel_1.default.findOne({
                name: channelNameInput,
            });
            if (channel == null)
                return false;
            const user = yield user_1.default.findOne({
                _id: req.session.userId,
            });
            if (user.channels.includes(channelNameInput) == true) {
                return true;
            }
            else {
                yield user.channels.push(channelNameInput);
                yield channel.members.push(user.username);
                user.save();
                channel.save();
                return true;
            }
        });
    }
    createMessage(input, { req }, pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield channel_1.default.findOne({
                    name: input.channelName,
                });
                const UTC = new Date().toUTCString();
                const msg = channel.messages.addToSet({
                    text: input.text,
                    user: req.session.name,
                    date: UTC,
                });
                channel.save();
                const payload = {
                    _id: msg[0]._id,
                    user: msg[0].user,
                    date: msg[0].date,
                    channelName: input.channelName,
                    text: msg[0].text,
                };
                yield pubsub.publish("MESSAGES", payload);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    createFile(file, channelName, { req }, pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield channel_1.default.findOne({
                    name: channelName,
                });
                const { createReadStream } = yield file;
                const UTC = new Date().toUTCString();
                const filename = uuid_1.v4();
                yield new Promise((res) => createReadStream()
                    .pipe(fs_1.createWriteStream(path_1.default.join(__dirname, `/../../images`, filename)))
                    .on("close", res));
                const msg = channel.messages.addToSet({
                    image: filename,
                    user: req.session.name,
                    date: UTC,
                });
                channel.save();
                const payload = {
                    _id: msg[0]._id,
                    user: msg[0].user,
                    date: msg[0].date,
                    channelName: channelName,
                    image: msg[0].image,
                };
                yield pubsub.publish("MESSAGES", payload);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    createChannel(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let channel = yield channel_1.default.findOne({
                    name: input,
                });
                if (channel == null) {
                    channel = new channel_1.default({
                        name: input,
                        owner: req.session.name,
                        members: [req.session.name],
                    });
                }
                else {
                    return {
                        errors: {
                            field: "name",
                            message: "이미 있는 name",
                        },
                    };
                }
                const result = yield channel.save();
                const user = yield user_1.default.findOne({
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
            }
            catch (err) {
                return {
                    errors: {
                        field: "create channel",
                        message: err,
                    },
                };
            }
        });
    }
};
__decorate([
    type_graphql_1.Subscription({
        topics: ["MESSAGES"],
        filter: ({ payload, args, }) => payload.channelName === args.channelName,
    }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, type_1.NewMessageArgs]),
    __metadata("design:returntype", type_1.Message)
], ChannelResolver.prototype, "newMessage", null);
__decorate([
    type_graphql_1.Query(() => [String], { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("channelName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "allChannelMember", null);
__decorate([
    type_graphql_1.Query(() => [type_1.Channel], { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "allChannel", null);
__decorate([
    type_graphql_1.Query(() => [type_1.Message]),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("channelName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "messages", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("channelNameInput")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "findChannel", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_1.MessageInput, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("file", () => graphql_upload_1.GraphQLUpload)),
    __param(1, type_graphql_1.Arg("channelName")),
    __param(2, type_graphql_1.Ctx()),
    __param(3, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createFile", null);
__decorate([
    type_graphql_1.Mutation(() => type_1.ChannelResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
ChannelResolver = __decorate([
    type_graphql_1.Resolver(type_1.Channel)
], ChannelResolver);
exports.ChannelResolver = ChannelResolver;
//# sourceMappingURL=channel.js.map