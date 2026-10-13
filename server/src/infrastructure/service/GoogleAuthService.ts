import { injectable } from "tsyringe";
import { OAuth2Client } from "google-auth-library";

import {
    GoogleUserInfo,
    IGoogleAuthService,
} from "../../domain/interfaces/services/IGoogleAuthService";

import { env } from "../../config/env";

// @injectable()
// export class GoogleAuthService implements IGoogleAuthService {
//     private readonly _client: OAuth2Client;

//     constructor() {
//         this._client = new OAuth2Client(
//             env.GOOGLE_CLIENT_ID,
//             env.GOOGLE_CLIENT_SECRET,
//             env.GOOGLE_REDIRECT_URI
//         );
//     }

    

//     async verifyCode(code: string): Promise<GoogleUserInfo> {
//         try {
//             console.log("Google authorization code received");

//             const { tokens } = await this._client.getToken(code);

//             console.log("Google tokens received");

//             if (!tokens.id_token) {
//                 throw new Error("Google ID token not received");
//             }

//             const ticket = await this._client.verifyIdToken({
//                 idToken: tokens.id_token,
//                 audience: env.GOOGLE_CLIENT_ID,
//             });

//             const payload = ticket.getPayload();

//             if (!payload) {
//                 throw new Error("Invalid Google account information");
//             }

//             if (!payload.sub || !payload.email) {
//                 throw new Error(
//                     "Google account information is incomplete"
//                 );
//             }

//             console.log("Google user verified:", payload.email);

//             return {
//                 googleId: payload.sub,
//                 email: payload.email,
//                 firstName: payload.given_name ?? "",
//                 lastName: payload.family_name ?? "",
//                 profileImage: payload.picture,
//             };
//         } catch (error) {
//             console.error("GOOGLE AUTH SERVICE ERROR:", error);
//             throw error;
//         }
//     }
// }
@injectable()
export class GoogleAuthService implements IGoogleAuthService {
    private readonly _client: OAuth2Client;

    constructor() {
        this._client = new OAuth2Client(
            env.GOOGLE_CLIENT_ID,
            env.GOOGLE_CLIENT_SECRET,
            env.GOOGLE_REDIRECT_URI
        );
    }

    getAuthorizationUrl(): string {
        return this._client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "openid",
                "email",
                "profile",
            ],
            prompt: "select_account",
        });
    }

    async verifyCode(code: string): Promise<GoogleUserInfo> {
        const { tokens } = await this._client.getToken(code);

        if (!tokens.id_token) {
            throw new Error("Google ID token not received");
        }

        const ticket = await this._client.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error("Invalid Google account information");
        }

        if (!payload.sub || !payload.email) {
            throw new Error(
                "Google account information is incomplete"
            );
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            firstName: payload.given_name ?? "",
            lastName: payload.family_name ?? "",
            profileImage: payload.picture,
        };
    }
}