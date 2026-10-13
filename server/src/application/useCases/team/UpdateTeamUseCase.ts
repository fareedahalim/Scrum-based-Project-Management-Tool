import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { IUpdateTeamUseCase } from "../../interface/team/IUpdateTeamUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";

import { UpdateTeamDTO } from "../../dtos/team/requestDTOs/UpdateTeamDTO";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

@injectable()
export class UpdateTeamUseCase
    implements IUpdateTeamUseCase {
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,


        @inject("IUserRepository")
        private _userRepo: IUserRepository
    ) { }

    async execute(
        teamId: string,
        dto: UpdateTeamDTO
    ): Promise<TeamResponseDTO> {
        // 1. Check whether the team exists

        if (!mongoose.isValidObjectId(teamId)) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
        }
        const existingTeam =
            await this._teamRepo.findById(teamId);

        if (!existingTeam) {
            throw new Error(
                TEAM_ERRORS.TEAM_NOT_FOUND
            );
        }

        // 2. Prepare update data
        const updateData: UpdateTeamDTO = {};

        if (dto.name !== undefined) {
            const name = dto.name.trim();

            if (!name) {
                throw new Error(
                    TEAM_ERRORS.TEAM_NAME_REQUIRED
                );
            }

            // 3. Check whether another team
            // already uses this name
            const teamWithSameName =
                await this._teamRepo.findByName(name);

            if (
                teamWithSameName &&
                teamWithSameName._id !== teamId
            ) {
                throw new Error(
                    TEAM_ERRORS.TEAM_ALREADY_EXISTS
                );
            }

            updateData.name = name;
        }

        if (dto.description !== undefined) {
            const description =
                dto.description.trim();

            if (!description) {
                throw new Error(
                    TEAM_ERRORS.TEAM_DESCRIPTION_REQUIRED
                );
            }

            updateData.description = description;
        }

        // 4. Update the team
        const updatedTeam =
            await this._teamRepo.updateTeam(
                teamId,
                updateData
            );

        if (!updatedTeam) {
            throw new Error(
                TEAM_ERRORS.TEAM_NOT_FOUND
            );
        }

        const leadUser = await this._userRepo.findById(
            updatedTeam.lead
        );

        if (!leadUser) {
            throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
        }

        // 5. Return response
        return {
            id: updatedTeam._id!,
            name: updatedTeam.name,
            description: updatedTeam.description,
            lead: {
                id: updatedTeam.lead,
                firstName: leadUser.firstName,
                lastName: leadUser.lastName,
            },
            createdAt: updatedTeam.createdAt,
            updatedAt: updatedTeam.updatedAt,
        };
    }
}