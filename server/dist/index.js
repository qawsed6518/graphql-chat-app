"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const channel_1 = require("./resolvers/channel");
const http = __importStar(require("http"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection_url = "mongodb+srv://qwerty:96zSMUQQI3k4X4bL@cluster0.wqhrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    yield mongoose_1.default
        .connect(connection_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
        .then(() => {
        console.log("MongoDB Connected");
    })
        .catch((err) => {
        console.log(err);
    });
    const app = express_1.default();
    const mongo = connect_mongo_1.default.create({ mongoUrl: connection_url });
    app.use(cors_1.default({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    const sessionMiddleware = express_session_1.default({
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
    const server = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [user_1.UserResolver, channel_1.ChannelResolver],
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
            onConnect: (_, ws) => {
                return new Promise((res) => sessionMiddleware(ws.upgradeReq, {}, () => {
                    res({ req: ws.upgradeReq });
                }));
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
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map