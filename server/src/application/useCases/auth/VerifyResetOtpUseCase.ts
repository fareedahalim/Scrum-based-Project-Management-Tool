import { IVerifyResetOtpUseCase } from "../../interface/auth/IVerifyResetOtpUseCase";
import { VerifyResetOtpDTO } from "../../dtos/auth/requestDTOs/VerifyResetOtpDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/Otp/IOtpRepository";



@injectable()
export class VerifyResetOtpUseCase implements IVerifyResetOtpUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('IOtpRepository') private _otpRepo: IOtpRepository
  ) { }
  async execute(dto: VerifyResetOtpDTO): Promise<void> {
    console.log("entering verifyResetOtp usecase")

    const user = await this._userRepo.findByEmail(dto.email);
    console.log("in verifyResetOtp usecase",user)
    if (!user || !user._id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }
    const otp = await this._otpRepo.findValidOtp(user.email, dto.otp);
    if (!otp ) throw new Error(ERROR_MESSAGES.INVALID_OTP);
    await this._otpRepo.deleteByEmail(user.email);
  }
}