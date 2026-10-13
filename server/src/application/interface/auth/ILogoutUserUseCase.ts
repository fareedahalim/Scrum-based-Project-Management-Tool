export interface ILogoutUserUseCase {
    execute(accessToken: string): Promise<void>
}