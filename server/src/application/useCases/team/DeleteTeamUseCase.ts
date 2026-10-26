import { inject, injectable } from "tsyringe";
import { IDeleteTeamUseCase } from "../../interface/team/IDeleteTeamUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class DeleteTeamUseCase implements IDeleteTeamUseCase {
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,

        @inject("IProjectRepository")
        private _projectRepo: IProjectRepository,
    ) {}

    async execute(teamId: string): Promise<void> {
        const existingTeam = await this._teamRepo.findById(teamId);

        if (!existingTeam || existingTeam.isDeleted) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
        }

        // Check projects assigned to this team
        const projects = await this._projectRepo.getProjectsByTeam(teamId);

        const hasUnfinishedProject = projects.some(
            (project) =>
                project.status !== "COMPLETED" &&
                project.status !== "ARCHIVED"
        );

        if (hasUnfinishedProject) {
            throw new Error(
                "Cannot delete this team because it is assigned to an unfinished project."
            );
        }

        const deleted = await this._teamRepo.deleteTeam(teamId);

        if (!deleted) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
        }
    }
}