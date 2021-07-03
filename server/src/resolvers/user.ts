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

@Resolver(User)
export class UserResolver {
    @Query(() => MeResponse)
    async me(@Ctx() { req }: MyContext): Promise<MeResponse> {
        if (req.session.name == null) {
            return { loggedIn: false };
        }

        const me = await Usermodel.findOne({ username: req.session.name });
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
                req.session.name = user.username;
                console.log(req.session);
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
