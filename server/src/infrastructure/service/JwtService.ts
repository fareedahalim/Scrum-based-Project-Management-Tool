// import { jwt } from "zod";
import jwt from 'jsonwebtoken'
import { env } from "../../config/env";
import { JwtPayload } from "../../domain/entities/Jwt/IJwtPayload";
import { IJwtService } from "../../domain/interfaces/services/IJwtService";
import { ERROR_MESSAGES } from '../../domain/constants/errorMessages';

export class JwtService implements IJwtService{
    private _ACCESS_SECRET: string
    private _REFRESH_SECRET: string
    
    constructor(){
        this._ACCESS_SECRET = env.JWT_ACCESS_SECRET
        this._REFRESH_SECRET = env.JWT_REFRESH_SECRET
    }

    signAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this._ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRATION as jwt.SignOptions["expiresIn"] })
    }

    signRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this._REFRESH_SECRET, {expiresIn: env.JWT_REFRESH_EXPIRATION as jwt.SignOptions["expiresIn"],})    
    }

    verifyAccessToken(token: string): JwtPayload  {
        try {
            return jwt.verify(token, this._ACCESS_SECRET) as JwtPayload
        } catch {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
            
        }
    }

    verifyRefreshToken(token: string): JwtPayload  {
        try {
            return jwt.verify(token, this._REFRESH_SECRET) as JwtPayload
        } catch  {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }
    }
}