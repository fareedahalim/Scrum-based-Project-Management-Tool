import { inject, injectable } from "tsyringe";

import { IRemoveTeamMemberUseCase } from "../../interface/team/IRemoveTeamMemberUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class RemoveTeamMemberUseCase
    implements IRemoveTeamMemberUseCase
{
    constructor(
        @inject("ITeamRepository")
        private _teamRepo: ITeamRepository,

        @inject("ITeamMemberRepository")
        private _teamMemberRepo: ITeamMemberRepository,

        @inject("IProjectRepository")
        private _projectRepo: IProjectRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepo: IProjectMemberRepository,
    ) {}

    async execute(teamId: string, userId: string): Promise<void> {
        const team = await this._teamRepo.findById(teamId);

        if (!team || team.isDeleted) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
        }

        const membership = await this._teamMemberRepo.findMembership(
            teamId,
            userId
        );

        if (!membership) {
            throw new Error(TEAM_ERRORS.TEAM_MEMBER_NOT_FOUND);
        }

        if (String(team.lead) === userId) {
            throw new Error(TEAM_ERRORS.TEAM_LEAD_CANNOT_BE_REMOVED);
        }

        // Check whether this team is assigned to an unfinished project
        const teamProjects = await this._projectRepo.getProjectsByTeam(teamId);

        const teamHasUnfinishedProject = teamProjects.some(
            (project) =>
                project.status !== "COMPLETED" &&
                project.status !== "ARCHIVED"
        );

        if (teamHasUnfinishedProject) {
            throw new Error(
                "Cannot remove this member because the team is assigned to an unfinished project."
            );
        }

        // Check the member's individual project memberships,
        // including assignments as Product Owner or Scrum Master.
        const projectMemberships =
            await this._projectMemberRepo.getProjectsByUser(userId);

        for (const projectMembership of projectMemberships) {
            if (projectMembership.status !== "ACTIVE") {
                continue;
            }

            const project = await this._projectRepo.findById(
                String(projectMembership.projectId)
            );

            if (
                project &&
                project.status !== "COMPLETED" &&
                project.status !== "ARCHIVED"
            ) {
                throw new Error(
                    "Cannot remove this member because they are assigned to an unfinished project."
                );
            }
        }

        const removed = await this._teamMemberRepo.removeMember(
            teamId,
            userId
        );

        if (!removed) {
            throw new Error(TEAM_ERRORS.TEAM_MEMBER_NOT_FOUND);
        }
    }
}