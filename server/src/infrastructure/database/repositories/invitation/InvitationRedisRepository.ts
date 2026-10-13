import { injectable } from "tsyringe";

import { IInvitationRedisRepository } from "../../../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";
import { redisClient } from "../../../cache/redisClient";

@injectable()
export class InvitationRedisRepository
  implements IInvitationRedisRepository
{
  async saveToken(
    token: string,
    email: string,
    invitationId: string,
    expiresInSeconds: number
  ): Promise<void> {
    const key = `invitation:${token}`;

    const invitationKey = `invitation:id:${invitationId}`;

    const value = JSON.stringify({
      email,
      invitationId,
    });

    await redisClient.set(
      key,
      value,
      "EX",
      expiresInSeconds
    );


    await redisClient.set(
      invitationKey,
      token,
      "EX",
      expiresInSeconds
    )
  }

  async getTokenData(
    token: string
  ): Promise<{
    email: string;
    invitationId: string;
  } | null> {
    const key = `invitation:${token}`;

    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }


  async deleteToken(token: string): Promise<void> {
    const key = `invitation:${token}`;

    await redisClient.del(key);
  }


   async deleteTokenByInvitationId(invitationId: string): Promise<void> {

    const invitationKey = `invitation:id:${invitationId}`;

    const token = await redisClient.get(invitationKey);

    if(!token) {
      return;
    }

    await redisClient.del(`invitation:${token}`);

    await redisClient.del(invitationKey);
    
  }
}