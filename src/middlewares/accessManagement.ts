import { Request, Response, NextFunction } from "express";
import { routesAccess } from "./../routes";
import { User } from "../Model/User.model";
import dbConnect from "../utils/dbConnect";

export async function accessManagement(request: Request, response: Response, next: NextFunction) {
    const routeAccess: undefined | string[] = routesAccess["request.route.path"]?.[request.method.toLocaleLowerCase()]

    if (!routeAccess) return next();

    await dbConnect();

    const user = await User.findById(request.user_id).select("role email").exec()

    if (!user) throw Error("authentication/user-does-not-exist");

    if (!routeAccess.includes(user.role)) throw Error("access-denied")

    return next();
}