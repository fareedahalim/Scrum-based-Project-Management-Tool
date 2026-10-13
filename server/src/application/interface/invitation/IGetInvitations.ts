import { IInvitationEntity } from "../../../domain/entities/Invitation/IInvitationEntity";

export interface IGetInvitationsUseCase {
  execute(): Promise<IInvitationEntity[]>;
}