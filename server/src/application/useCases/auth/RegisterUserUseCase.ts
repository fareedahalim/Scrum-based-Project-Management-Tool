import {inject, injectable} from "tsyringe";
import { IRegisterUserCase } from "../../interface/auth/IRegisterUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { RegisterUserDTO } from "../../dtos/auth/requestDTOs/RegisterUserDTO";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { ISendEmailOtpUseCase } from "../../interface/auth/ISendEmailOtpUseCase";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class RegisterUserUseCase implements IRegisterUserCase {
    constructor(
        @inject('IUserRepository') private _userRepository: IUserRepository,
        @inject('IPasswordService') private _passwordService: IPasswordService,
        @inject('ISendEmailOtpUseCase') private _sendEmailOtpUseCase: ISendEmailOtpUseCase
    ){}

    async execute(dto: RegisterUserDTO): Promise<void> {
        const existingUser = await this._userRepository.findByEmail(dto.email);
        if(existingUser) {
          throw new Error(USER_ERRORS.USER_ALREADY_EXISTS)
        }
        const hashedPassword = await this._passwordService.hash(dto.password)

        await this._sendEmailOtpUseCase.execute({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        })
    }
}