export interface GoogleUserInfo {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
}

export interface IGoogleAuthService {
    getAuthorizationUrl(): string;

    verifyCode(code: string): Promise<GoogleUserInfo>;
}