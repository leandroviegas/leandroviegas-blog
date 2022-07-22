import "express-async-errors"
import express, { NextFunction, Request, Response } from "express"
import { GetError } from "./lang/index"
import { router } from "./routes"
import cors from 'cors'

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());

app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof Error) {
            // Get the error translated to the language you want
            const error: { message: string, status: number } = GetError(err.message, process.env.LANGUAGE)
            // If found the error
            if (error)
                return response.status(error.status).json({ code: err.message, message: error.message });

            return response.status(400).json({ message: err.message });
        }
        return next(response.status(500).json({
            status: "error",
            message: "Internal Server Error",
        }));
    }
);

app.listen("3333", () => {
    console.log("Server is running.");
});