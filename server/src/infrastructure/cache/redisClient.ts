import Redis from 'ioredis';
import { env } from '../../config/env';

export const redisClient = new Redis(env.REDIS_URL);

redisClient.on('connect',()=>{
    console.log("Redis Connected");
})

redisClient.on('error',(error)=>{
    console.log("Redis error:", error);
});