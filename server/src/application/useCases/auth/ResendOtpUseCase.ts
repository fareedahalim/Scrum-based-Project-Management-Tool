import { inject, injectable } from "tsyringe";
import { IResendOtpUseCase } from "../../interface/auth/IResendOtpUseCase";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { IOtpRepository } from "../../../domain/interfaces/repositories/Otp/IOtpRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ResenedOtpUseCase implements IResendOtpUseCase {
    constructor(
        @inject('ITempUserStore') private _tempUserStore : ITempUserStore,
        @inject('IOtpRepository') private _otpRepository: IOtpRepository,
        @inject('IEmailService') private _emailService: IEmailService
    ){}

    async execute(email: string): Promise <void> {
        const tempUser = await this._tempUserStore.get(email);
        if(!tempUser) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }

        await this._otpRepository.deleteByEmail(email);
         const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

         


        await this._otpRepository.createOtp({
            userId: email,
            code: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            createdAt: new Date
        })
        await this._emailService.sendOtp(email,otpCode)
    }
}