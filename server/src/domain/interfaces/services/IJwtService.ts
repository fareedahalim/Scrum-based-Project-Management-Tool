import { JwtPayload } from "../../entities/Jwt/IJwtPayload";

export interface IJwtService {
    signAccessToken(payload: JwtPayload): string
    signRefreshToken(payload: JwtPayload): string
    verifyAccessToken(token: string): JwtPayload 
    verifyRefreshToken(token: string): JwtPayload 
}