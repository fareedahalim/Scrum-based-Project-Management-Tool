import { inject, injectable } from "tsyringe";

import { IGetTeamsUseCase } from "../../interface/team/IGetTeamsUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";

import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

import { UserRoles } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

@injectable()
export class GetTeamsUseCase
    implements IGetTeamsUseCase {
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,

        @inject("IUserRepository")
        private _userRepo: IUserRepository
    ) { }

    async execute(
        userId: string,
        role: UserRoles
    ): Promise<TeamResponseDTO[]> {

        let teams;

        if (role === UserRoles.ADMIN) {
            teams = await this._teamRepo.getAllTeams();
        } else {
            teams = await this._teamRepo.getTeamsByMember(userId);
        }

        const teamResponses = await Promise.all(
            teams.map(async (team) => {

                const lead = await this._userRepo.findById(
                    team.lead
                );

                return {
                    id: team._id!,
                    name: team.name,
                    description: team.description,

                    lead: {
                        id: team.lead,
                        firstName: lead?.firstName ?? "",
                        lastName: lead?.lastName ?? "",
                    },

                    createdAt: team.createdAt,
                    updatedAt: team.updatedAt,
                };
            })
        );

        return teamResponses;
    }
}