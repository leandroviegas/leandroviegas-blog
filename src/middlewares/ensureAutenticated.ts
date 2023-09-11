import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
    email: string;
    role: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        throw new Error("authentication/not-logged-in")
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub, role } = verify(token, `${process.env.JSONWEBTOKEN_DECODE_KEY}`) as IPayload;

        request.user_id = sub;
        request.user_role = role;

        return next();
    } catch (e) {
        console.error(e)
        throw new Error("authentication/invalid-token")
    }
}