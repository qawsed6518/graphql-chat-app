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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_1 = __importDefault(require("../models/user"));
const isAuth_1 = require("../middleware/isAuth");
const type_1 = require("./type");
const fs_1 = require("fs");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId == null) {
                return { loggedIn: false };
            }
            const me = yield user_1.default.findOne({ _id: req.session.userId });
            return {
                loggedIn: true,
                user: me,
            };
        });
    }
    allUser() {
        return user_1.default.find();
    }
    profilePicture(file, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({
                    _id: req.session.userId,
                });
                const filename = uuid_1.v4();
                const { createReadStream } = yield file;
                yield new Promise((res) => createReadStream()
                    .pipe(fs_1.createWriteStream(path_1.default.join(__dirname, `/../../images`, filename)))
                    .on("close", res));
                user.set("image", filename);
                user.save();
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield user_1.default.findOne({ username: options.username });
                if (user == null) {
                    user = new user_1.default({
                        username: options.username,
                        password: options.password,
                    });
                }
                else {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "?????? ?????? ID",
                            },
                        ],
                    };
                }
                user.save();
                req.session.userId = user._id;
                req.session.name = user.username;
                return {
                    user: user,
                };
            }
            catch (err) {
                return {
                    errors: [
                        {
                            field: "register",
                            message: err,
                        },
                    ],
                };
            }
        });
    }
    login(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({
                    username: options.username,
                });
                if (user == null) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "?????? username",
                            },
                        ],
                    };
                }
                if (user.password == options.password) {
                    req.session.userId = user._id;
                    req.session.name = user.username;
                    return {
                        user: user,
                    };
                }
                else {
                    return {
                        errors: [
                            {
                                field: "password",
                                message: "?????? password",
                            },
                        ],
                    };
                }
            }
            catch (err) {
                return {
                    errors: [
                        {
                            field: "login",
                            message: err,
                        },
                    ],
                };
            }
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie("qid");
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
__decorate([
    type_graphql_1.Query(() => type_1.MeResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => [type_1.User], { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "allUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("file", () => graphql_upload_1.GraphQLUpload)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "profilePicture", null);
__decorate([
    type_graphql_1.Mutation(() => type_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => type_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(type_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map