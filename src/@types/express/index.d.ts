declare namespace Express {
    export interface Request {
        user_id: string;
        user: {
            sub: string,
            displayName: string,
            given_name: string,
            family_name: string,
            picture: string,
            email: string,
            email_verified: boolean,
            language: string
        };
    }
}