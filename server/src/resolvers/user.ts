import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import Usermodel from "../models/user";
import { isAuth } from "../middleware/isAuth";
import { User, UserResponse, MeResponse, UsernamePasswordInput } from "./type";
import { createWriteStream } from "fs";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import path from "path";
import { v4 as uuidv4 } from "uuid";

@Resolver(User)
export class UserResolver {
    @Query(() => MeResponse)
    async me(@Ctx() { req }: MyContext): Promise<MeResponse> {
        if (req.session.userId == null) {
            return { loggedIn: false };
        }

        const me = await Usermodel.findOne({ _id: req.session.userId });
        return {
            loggedIn: true,
            user: me,
        };
    }

    @Query(() => [User], { nullable: true })
    @UseMiddleware(isAuth)
    allUser(): Promise<User[]> {
        return Usermodel.find();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async profilePicture(
        @Arg("file", () => GraphQLUpload) file: FileUpload,
        @Ctx() { req }: MyContext
    ) {
        try {
            const user = await Usermodel.findOne({
                _id: req.session.userId,
            });

            const filename = uuidv4();

            const { createReadStream } = await file;
            await new Promise((res) =>
                createReadStream()
                    .pipe(
                        createWriteStream(
                            path.join(__dirname, `/../../images`, filename)
                        )
                    )
                    .on("close", res)
            );

            user.set("image", filename);
            user.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        try {
            let user = await Usermodel.findOne({ username: options.username });
            if (user == null) {
                user = new Usermodel({
                    username: options.username,
                    password: options.password,
                });
            } else {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "이미 있는 ID",
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
        } catch (err) {
            return {
                errors: [
                    {
                        field: "register",
                        message: err,
                    },
                ],
            };
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        try {
            const user = await Usermodel.findOne({
                username: options.username,
            });
            if (user == null) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "없는 username",
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
            } else {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "틀린 password",
                        },
                    ],
                };
            }
        } catch (err) {
            return {
                errors: [
                    {
                        field: "login",
                        message: err,
                    },
                ],
            };
        }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie("qid");
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }
}
