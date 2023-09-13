import "express-async-errors"
import express, { NextFunction, Request, Response } from "express"
import { GetError } from "./lang/index"
import { router } from "./routes"
import cors from 'cors'

// Google authentication
import passport from 'passport';
import cookieSession from 'cookie-session';
import '@utils/passport';
import { AuthenticateUserService } from "@services/AuthenticateUserService"
import ConnectDB from "@utils/ConnectDB"


const authenticateUserService = new AuthenticateUserService();

const app = express();

app.use(
    cors({
        origin: JSON.parse(process.env.CORS_ORIGIN),
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(router);

app.get('/auth', async (req, res) => {
    req.session.originRequestLink = req.query.originRequestLink;
    res.redirect("/auth/scope")
});

// Auth
app.get('/auth/scope', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

// Auth Callback
app.get('/auth/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    }));

// Success 
app.get('/auth/callback/success', async (req, res) => {
    if (!req.user)
        res.redirect('/auth/callback/failure');

    const token = await authenticateUserService.GoogleAuth(req.user);

    res.redirect(`${req.session.originRequestLink}?token=${encodeURIComponent(JSON.stringify(token))}`);
});

// failure
app.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
})

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof Error) {
            // Get the error translated to the language you want
            const error: { message: string, status: number } = GetError(err.message, process.env.LANGUAGE)
            console.error(err)
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

ConnectDB().then(() => {
    app.listen(process.env.PORT || 3333, () => {
        console.log(`Listening port: ${process.env.PORT || 3333}`);
    })
})

