
import { inject, injectable } from "tsyringe";

import { IUpdateProjectUseCase } from "../../interface/project/IUpdateProjectUseCase";

import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { UpdateProjectDTO } from "../../dtos/project/requestDTOs/UpdateProjectDTO";
import { ProjectResponseDTO } from "../../dtos/project/responseDTOs/ProjectResponseDTO";
import { ProjectStatus } from "../../../domain/enums/ProjectStatus";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
    constructor(
        @inject("IProjectRepository")
        private readonly _projectRepository: IProjectRepository,

        @inject("ITeamRepository")
        private readonly _teamRepository: ITeamRepository,
    ) {}

    async execute(
        projectId: string,
        data: UpdateProjectDTO
    ): Promise<ProjectResponseDTO> {

        // 1. Find the existing project
        const existingProject =
            await this._projectRepository.findById(projectId);

        if (!existingProject) {
            throw new AppError(
                PROJECT_ERRORS.PROJECT_NOT_FOUND,
                404
            );
        }

        // 2. Only planning projects can be updated
if (existingProject.status !== ProjectStatus.PLANNING) {
    throw new AppError(
        "Only projects in Planning status can be updated.",
        409
    );
}

        // 3. Determine the final dates after the update
        const startDate = data.startDate
            ? new Date(data.startDate)
            : existingProject.startDate;

        const endDate =
            data.endDate !== undefined
                ? data.endDate
                    ? new Date(data.endDate)
                    : null
                : existingProject.endDate;

        if (endDate && endDate < startDate) {
            throw new AppError(
                PROJECT_ERRORS.PROJECT_END_DATE_CAN_NOT_EARLIER_THAN_START_DATE,
                400
            );
        }

        // 4. Determine the final team and status
        const newTeamId = data.teamId ?? existingProject.teamId;

        const teamIsChanging =
            newTeamId.toString() !== existingProject.teamId.toString();

       
        // 5. Check team availability when necessary
        if (teamIsChanging ) {
            const team = await this._teamRepository.findById(newTeamId);

            if (!team) {
                throw new AppError(
                    PROJECT_ERRORS.PROJECT_TEAM_NOT_FOUND,
                    404
                );
            }

            const teamProjects =
    await this._projectRepository.getProjectsByTeam(newTeamId);

const teamIsUnavailable = teamProjects.some(
    (project) =>
        project._id?.toString() !== projectId.toString() &&
        project.status !== ProjectStatus.COMPLETED &&
        project.status !== ProjectStatus.ARCHIVED
);

if (teamIsUnavailable) {
    throw new AppError(
        PROJECT_ERRORS.PROJECT_TEAM_ALREADY_ASSIGNED,
        409
    );
}
        }

        // 6. Prepare the update
        const updateData: Partial<IProjectEntity> = {};

        if (data.name !== undefined) {
            updateData.name = data.name.trim();
        }

        if (data.description !== undefined) {
            updateData.description = data.description.trim();
        }

        if (data.priority !== undefined) {
            updateData.priority = data.priority;
        }

        if (data.status !== undefined) {
            updateData.status = data.status;
        }

        if (data.startDate !== undefined) {
            updateData.startDate = startDate;
        }

        if (data.endDate !== undefined) {
            updateData.endDate = endDate;
        }

        if (data.teamId !== undefined) {
            updateData.teamId = data.teamId;
        }

        // 7. Save the changes
        const updatedProject =
            await this._projectRepository.updateProject(
                projectId,
                updateData
            );

        if (!updatedProject) {
            throw new AppError(
                PROJECT_ERRORS.PROJECT_UPDATION_FAILED,
                500
            );
        }

        // 8. Return the response DTO
        return {
            id: updatedProject._id!,
            name: updatedProject.name,
            key: updatedProject.key,
            description: updatedProject.description,
            status: updatedProject.status,
            priority: updatedProject.priority,
            startDate: updatedProject.startDate,
            endDate: updatedProject.endDate,
            teamId: updatedProject.teamId,
            createdBy: updatedProject.createdBy,
            createdAt: updatedProject.createdAt,
            updatedAt: updatedProject.updatedAt,
        };
    }
}
