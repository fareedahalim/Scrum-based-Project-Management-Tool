// import { ITempUserStore } from "../../domain/interfaces/services/ITempUserStore";

import { ITempUserData, ITempUserStore } from "../../domain/interfaces/services/ITempUserStore";
import { redisClient } from "../cache/redisClient";


export class RedisTempUserStore implements ITempUserStore {
     
    private getkey(email: string): string {
        return `temp-user:${email}`;

    }

    async save(email: string, data: ITempUserData, ttlSecond: number): Promise<void> {
        await redisClient.set(this.getkey(email),JSON.stringify(data),"EX",ttlSecond)
    }

    async get(email: string): Promise<ITempUserData | null> {
        const data = await redisClient.get(this.getkey(email));
        if(!data) {
            return null;
        }

        return JSON.parse(data)
    }

    async delete(email: string) : Promise<void> {
        await redisClient.del(this.getkey(email))
    }
}