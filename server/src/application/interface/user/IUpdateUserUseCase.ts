import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { UpdatedUserDTO } from "../../dtos/user/requestDTOs/UpdatedUserDTO";

export interface IUpdateUserUseCase {
    execute(dto: UpdatedUserDTO) : Promise<IUserEntity>
}