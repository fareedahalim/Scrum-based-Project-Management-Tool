export interface IRemoveTeamMemberUseCase {
  execute(teamId: string, userId: string): Promise<void>;
}