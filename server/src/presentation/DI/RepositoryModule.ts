import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repositories/User/IUserRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/Otp/IOtpRepository";
import { OtpRedisRepository } from "../../infrastructure/service/OtpRedisRepository";
import { UserRepository } from "../../infrastructure/database/repositories/User/UserRepository";
import { ITokenBlacklistRepository } from "../../domain/interfaces/repositories/JwtBlackList/ITokenBlacklistRepository";
import { RedisTokenBlacklistRepository } from "../../infrastructure/database/repositories/JwtBlockedList/RedisTokenBlacklistRepository";
import { IOrganizationRepository } from "../../domain/interfaces/repositories/Organization/IOrganizationRepository";
import { OrganizationRepository } from "../../infrastructure/database/repositories/Organization/OrganizationRepository";
import { IInvitationRepository } from "../../domain/interfaces/repositories/Invitation/IInvitationRepository";
import { IInvitationRedisRepository } from "../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";
import { InvitationRedisRepository } from "../../infrastructure/database/repositories/invitation/InvitationRedisRepository";
import { InvitationRepository } from "../../infrastructure/database/repositories/invitation/InvitationRepository";
import { ITeamRepository } from "../../domain/interfaces/repositories/Team/ITeamRepository";
import { TeamRepository } from "../../infrastructure/database/repositories/Team/TeamRepository";
import { ITeamMemberRepository } from "../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { TeamMemberRepository } from "../../infrastructure/database/repositories/TeamMember/TeamMemberRepository";

export class RepositoryModule {
    static registerModules(): void {

        container.register<IUserRepository>('IUserRepository',{
            useClass: UserRepository
        })

        container.register<IOtpRepository>('IOtpRepository', {
            useClass: OtpRedisRepository
        })

        container.register<ITokenBlacklistRepository>('ITokenBlacklistRepository',{
            useClass: RedisTokenBlacklistRepository
        })
        container.register<IOrganizationRepository>('IOrganizationRepository',{
            useClass: OrganizationRepository 
        })

        container.register<IInvitationRedisRepository>('IInvitationRedisRepository',{
            useClass:  InvitationRedisRepository
        })
        
        container.register<IInvitationRepository>('IInvitationRepository',{
            useClass:  InvitationRepository
        })

        container.register<ITeamRepository>('ITeamRepository',{
            useClass:  TeamRepository
        })

        container.register<ITeamMemberRepository>('ITeamMemberRepository',{
            useClass:  TeamMemberRepository
        })
       
        
        

       
    }
}