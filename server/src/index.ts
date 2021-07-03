import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { ChannelResolver } from "./resolvers/channel";
import * as http from "http";

const main = async () => {
    const connection_url =
        "mongodb+srv://qwerty:96zSMUQQI3k4X4bL@cluster0.wqhrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    await mongoose
        .connect(connection_url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("MongoDB Connected");
        })
        .catch((err: any) => {
            console.log(err);
        });

    const app = express();
    const mongo = MongoStore.create({ mongoUrl: connection_url });

    // app.set("trust proxy", 1);
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    const sessionMiddleware = session({
        name: "qid",
        secret: "qwerty",
        store: mongo,
        cookie: {
            maxAge: 86400 * 365 * 1000,
            httpOnly: true,
            sameSite: "lax",
        },
        resave: false,
        saveUninitialized: false,
    });

    app.use(sessionMiddleware);

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ChannelResolver],
            validate: false,
        }),

        context: ({ req, res, connection }) => ({
            req,
            res,
            connection,
            mongo,
        }),

        subscriptions: {
            path: "/subscriptions",
            onConnect: (_, ws: any) => {
                return new Promise((res) =>
                    sessionMiddleware(ws.upgradeReq, {} as any, () => {
                        res({ req: ws.upgradeReq });
                    })
                );
            },
        },
    });

    server.applyMiddleware({
        app,
        cors: false,
    });

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen(4000, () => {
        console.log(
            `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
        );
    });
};

main().catch((err) => {
    console.error(err);
});
