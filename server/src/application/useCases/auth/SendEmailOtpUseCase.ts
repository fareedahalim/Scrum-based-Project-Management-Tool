import { inject, injectable } from "tsyringe";
import { ISendEmailOtpUseCase } from "../../interface/auth/ISendEmailOtpUseCase";
import { IOtpRepository } from "../../../domain/interfaces/repositories/Otp/IOtpRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { ITempUserData, ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { IOtpEntity } from "../../../domain/entities/Otp/IOtpEntity";

@injectable()
export class SendEmailOtpUseCase implements ISendEmailOtpUseCase {
    constructor(
        @inject('IOtpRepository') private _otpRepo: IOtpRepository,
        @inject('IEmailService') private _emailService: IEmailService,
        @inject('ITempUserStore') private _tempUserRepo: ITempUserStore
    ) { }

    async execute(userData: ITempUserData): Promise<void> {

        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("sendEmailOtpUSeCase otpCode==",otpCode)
        const ttlSecond = 10 * 60

        await this._tempUserRepo.save(userData.email, userData, ttlSecond);

        const otp: IOtpEntity = {

            userId: userData.email,
            code: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            createdAt: new Date(),
        }

        await this._otpRepo.createOtp(otp);
        await this._emailService.sendOtp(userData.email, otpCode);
    }
}