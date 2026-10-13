import { injectable } from "tsyringe";
import { IOtpRepository } from "../../domain/interfaces/repositories/Otp/IOtpRepository";
import { redisClient } from "../cache/redisClient";
import { IOtpEntity } from "../../domain/entities/Otp/IOtpEntity";

@injectable()
export class OtpRedisRepository implements IOtpRepository {

    private getKey(email: string): string {
        return `otp:${email}`;
    }

    async createOtp(
        otp: IOtpEntity
    ): Promise<void> {

        const ttlSeconds = Math.floor(
            (otp.expiresAt.getTime() - Date.now()) / 1000
        );

        await redisClient.set(
            this.getKey(otp.userId),
            JSON.stringify(otp),
            "EX",
            ttlSeconds
        );
    }

    async findValidOtp(
        email: string,
        code: string
    ): Promise<IOtpEntity | null> {

        const data =
            await redisClient.get(this.getKey(email));

        if (!data) {
            return null;
        }

        const otp = JSON.parse(data);

        if (otp.code !== code) {
            return null;
        }

        const expiresAt = new Date(otp.expiresAt);

        if (expiresAt <= new Date()) {
            return null;
        }

        return {
            ...otp,
            expiresAt,
            createdAt: new Date(otp.createdAt),
        };
    }

    async deleteByEmail(
        email: string
    ): Promise<void> {

        await redisClient.del(
            this.getKey(email)
        );
    }
}