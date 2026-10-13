import { RegisterUserDTO } from "../../dtos/auth/requestDTOs/RegisterUserDTO";

export interface IRegisterUserCase {
    execute(dto: RegisterUserDTO): Promise<void>;
}