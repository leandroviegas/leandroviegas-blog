import { Request, Response, NextFunction } from "express";
import { routesAccess } from "./../routes";
import { User } from "@Models/User.model";

export async function accessManagement(request: Request, response: Response, next: NextFunction) {
    const routeAccess: undefined | string[] = routesAccess["request.route.path"]?.[request.method.toLocaleLowerCase()]

    if (!routeAccess) return next();

    const user = await User.findById(request.user_id).select("role email").exec()

    if (!user) throw Error("authentication/user-not-found");

    if (!routeAccess.includes(user.role)) throw Error("access-denied")

    return next();
}