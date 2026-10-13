export interface IDeleteTeamUseCase {
    execute(teamId: string): Promise<void>;
}