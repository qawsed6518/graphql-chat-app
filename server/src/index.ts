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
import { graphqlUploadExpress } from "graphql-upload";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const main = async () => {
    const connection_url =
        "mongodb+srv://~~~~";

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

    const mongo = MongoStore.create({ mongoUrl: connection_url });
    const app = express();
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    app.use("/images", express.static(path.join(__dirname, "../images")));
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
        uploads: false,
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
            path: "/graphql",
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

    process.setMaxListeners(0);

    existsSync(path.join(__dirname, "../images")) ||
        mkdirSync(path.join(__dirname, "../images"));
};

main().catch((err) => {
    console.error(err);
});
