import { inject, injectable } from "tsyringe";

import { IGetMyTeamUseCase } from "../../interface/team/IGetMyTeamUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { MyTeamResponseDTO } from "../../dtos/team/responseDTOs/MyTeamResponseDTO";

import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class GetMyTeamUseCase implements IGetMyTeamUseCase {
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,

        @inject("ITeamMemberRepository")
        private _teamMemberRepo: ITeamMemberRepository,

        @inject("IUserRepository")
        private _userRepo: IUserRepository
    ) {}

    async execute(
        userId: string
    ): Promise<MyTeamResponseDTO | null> {

        // 1. Find the logged-in user's team membership.
        const membership =
            await this._teamMemberRepo.findMembershipByUser(userId);

        if (!membership) {
            return null;
        }

        // 2. Find the active team.
        const team =
            await this._teamRepo.findById(membership.teamId);

        if (!team) {
            return null;
        }

        // 3. Find the team lead.
        const leadUser =
            await this._userRepo.findById(team.lead);

        if (!leadUser || !leadUser.isActive) {
            throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
        }

        // 4. Get all team memberships.
        const teamMemberships =
            await this._teamMemberRepo.getMembersByTeam(team._id!);

        // 5. Fetch the corresponding user details.
        const userResults = await Promise.all(
            teamMemberships.map((item) =>
                this._userRepo.findById(item.userId)
            )
        );

        const members = userResults
            .filter(
                (user) => user !== null && user.isActive
            )
            .map((user) => ({
                id: user!._id!,
                firstName: user!.firstName,
                lastName: user!.lastName,
                email: user!.email,
                profileImage: user!.profileImage,
            }));

        // 6. Return only the fields needed by the frontend.
        return {
            id: team._id!,
            name: team.name,
            description: team.description,
            lead: {
                id: leadUser._id!,
                firstName: leadUser.firstName,
                lastName: leadUser.lastName,
                email: leadUser.email,
                profileImage: leadUser.profileImage,
            },
            members,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        };
    }
}