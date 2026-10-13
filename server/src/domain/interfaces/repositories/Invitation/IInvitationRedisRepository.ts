export interface IInvitationRedisRepository {
    saveToken(token: string, email: string, invitationId: string, expiresInSeconds: number): Promise<void>;

    getTokenData(token: string): Promise<{ email: string, invitationId: string } | null>;

    deleteToken(token: string): Promise<void>;

    deleteTokenByInvitationId(
        invitationId: string
    ): Promise<void>;
}