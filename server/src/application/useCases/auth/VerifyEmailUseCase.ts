import { inject, injectable, injectAll } from "tsyringe";
import { IVerifyEmailUseCase } from "../../interface/auth/IVerifyEmailUseCase";
import { IOtpRepository } from "../../../domain/interfaces/repositories/Otp/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { UserRoles } from "../../../domain/enums/UserRole";
import { VerifyEmailDTO } from "../../dtos/auth/requestDTOs/VerifyEmailDTO";
@injectable()
export class VerifyEmailUseCase implements IVerifyEmailUseCase {
    constructor(
        @inject('IOtpRepository') private _otpRepo: IOtpRepository,
        @inject('ITempUserStore') private _tempUserStore: ITempUserStore,
        @inject('IUserRepository') private _userRepo: IUserRepository

    ){}

    async execute(dto: VerifyEmailDTO){
        const otp = await this._otpRepo.findValidOtp(dto.email, dto.otp);

        if(!otp) {
            throw new Error(ERROR_MESSAGES.INVALID_OTP);
        }
        const tempUser = await this._tempUserStore.get(dto.email);

        if(!tempUser) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        await this._userRepo.createUser({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            phone: tempUser.phone,
            password: tempUser.password,
            role: UserRoles.ADMIN,
            isActive: true,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await this._otpRepo.deleteByEmail(dto.email);
        await this._tempUserStore.delete(dto.email)

    }
}