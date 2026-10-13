import { IUserEntity } from "../../../domain/entities/User/IUserEntity";

export interface IDeactivateUserUseCase {
    execute(
        userId: string,
        currentUserId: string
    ): Promise<IUserEntity>;
}