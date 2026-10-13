import { IUserEntity } from "../../../domain/entities/User/IUserEntity";

export interface IGetUserByIdUseCase{
    execute(userId: string): Promise<IUserEntity>
}