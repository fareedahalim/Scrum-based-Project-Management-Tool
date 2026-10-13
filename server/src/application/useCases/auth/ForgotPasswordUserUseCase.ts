import { inject, injectable } from "tsyringe";
import { IForgotPasswordUserUseCase } from "../../interface/auth/IForgotPassword";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { IOtpRepository } from "../../../domain/interfaces/repositories/Otp/IOtpRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IOtpEntity } from "../../../domain/entities/Otp/IOtpEntity";
@injectable()
export class ForgotPasswordUserUseCase implements IForgotPasswordUserUseCase {
    constructor(
        @inject('IUserRepository') private _userRepo: IUserRepository,
        @inject('IOtpRepository') private _otpRepo: IOtpRepository,
        @inject('IEmailService') private _emailService: IEmailService
    ){}

    async execute(dto: ForgotPasswordDTO): Promise<void> {
        const user = await this._userRepo.findByEmail(dto.email)

        if(!user || !user._id) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otp: IOtpEntity = {
            userId: user.email,
            code: otpCode,
            expiresAt: new Date(Date.now() +10 * 60 * 1000),
            createdAt: new Date()
        }
        
        await this._otpRepo.createOtp(otp);
        await this._emailService.sendOtp(user.email, otpCode)

    }

    
}