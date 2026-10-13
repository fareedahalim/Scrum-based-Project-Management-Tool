import { inject, injectable } from "tsyringe";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/JwtBlackList/ITokenBlacklistRepository";
import { ILogoutUserUseCase } from "../../interface/auth/ILogoutUserUseCase";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class LogoutUserUseCase implements ILogoutUserUseCase {
    constructor(
        @inject("ITokenBlacklistRepository") private _blacklistRepo: ITokenBlacklistRepository,
        @inject('IJwtService') private _jwtService: IJwtService
    ){}

    async execute(accessToken: string): Promise<void> {
        const payload = this._jwtService.verifyAccessToken(accessToken)
        if(!payload) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }

        const decoded = payload as JwtPayload
        if(!decoded.exp) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }

        const exp = decoded.exp;
        const ttl = exp - Math.floor(Date.now() / 1000)
        if(ttl > 0) {
            await this._blacklistRepo.blacklist(accessToken,ttl)
        }


    }
}