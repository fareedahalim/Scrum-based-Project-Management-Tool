export interface ICancelInvitationUseCase {
  execute(id: string): Promise<void>;
}