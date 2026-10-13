import { inject, injectable } from "tsyringe";

import { IGetTeamByIdUseCase } from "../../interface/team/IGetTeamByIdUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";

import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";

import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

import { UserRoles } from "../../../domain/enums/UserRole";

import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

@injectable()
export class GetTeamByIdUseCase
    implements IGetTeamByIdUseCase {
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,

        @inject("ITeamMemberRepository")
        private _teamMemberRepo: ITeamMemberRepository,
        @inject("IUserRepository")
        private _userRepo: IUserRepository
    ) { }

    async execute(
        teamId: string,
        userId: string,
        role: UserRoles
    ): Promise<TeamResponseDTO> {

        const team =
            await this._teamRepo.findById(teamId);

        if (!team) {
            throw new Error(
                TEAM_ERRORS.TEAM_NOT_FOUND
            );
        }


        if (role !== UserRoles.ADMIN) {
            const membership =
                await this._teamMemberRepo.findMembership(
                    teamId,
                    userId
                );

            if (!membership) {
                throw new Error(
                    TEAM_ERRORS.TEAM_ACCESS_DENIED
                );
            }
        }

        const leadUser = await this._userRepo.findById(team.lead);
        if (!leadUser) {
            throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
        }
        return {
            id: team._id!,
            name: team.name,
            description: team.description,
            lead: {
                id: team.lead,
                firstName: leadUser.firstName,
                lastName: leadUser.lastName,
            },
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        };
    }
}