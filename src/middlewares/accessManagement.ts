import { Request, Response, NextFunction } from "express";
import { routesAccess } from "./../routes";
import { User } from "@Models/User.model";
import ConnectDB from "@utils/ConnectDB";

export async function accessManagement(request: Request, response: Response, next: NextFunction) {
    const routeAccess: undefined | string[] = routesAccess["request.route.path"]?.[request.method.toLocaleLowerCase()]

    if (!routeAccess) return next();

    await ConnectDB();

    const user = await User.findById(request.user_id).select("role email").exec()

    if (!user) throw Error("authentication/user-does-not-exist");

    if (!routeAccess.includes(user.role)) throw Error("access-denied")

    return next();
}