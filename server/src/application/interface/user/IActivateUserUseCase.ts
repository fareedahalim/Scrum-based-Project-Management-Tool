import { IUserEntity } from "../../../domain/entities/User/IUserEntity";

export interface IActivateUserUseCase {
    execute(userId: string): Promise<IUserEntity>
}