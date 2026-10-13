import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";

export interface IGetUsersUseCase {
    execute(): Promise<UserResponseDTO[]>
}