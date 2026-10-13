export interface IResendInvitationUseCase {
  execute(id: string): Promise<void>;
}