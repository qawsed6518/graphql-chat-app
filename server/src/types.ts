import { Request, Response } from "express";
import MongoStore from "connect-mongo";
import { Session } from "express-session";
import { ExecutionParams } from "subscriptions-transport-ws";

export type MyContext = {
    req: Request & { session?: Session & { userId?: string; name?: string } };
    res: Response;
    mongo: MongoStore;
    connection: ExecutionParams<any>;
};
