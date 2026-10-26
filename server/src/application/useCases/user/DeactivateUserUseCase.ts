
import { inject, injectable } from "tsyringe";

import { IDeactivateUserUseCase } from "../../interface/user/IDeactivateUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";

import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class DeactivateUserUseCase implements IDeactivateUserUseCase {
    constructor(
        @inject("IUserRepository")
        private _userRepo: IUserRepository,

        @inject("ITeamMemberRepository")
        private _teamMemberRepo: ITeamMemberRepository,

        @inject("IProjectMemberRepository")
        private _projectMemberRepo: IProjectMemberRepository,
    ) {}

    async execute(
        userId: string,
        currentUserId: string
    ): Promise<IUserEntity> {

        // 1. Prevent admin from deactivating their own account
        if (userId === currentUserId) {
            throw new Error(
                "You cannot deactivate your own account."
            );
        }

        // 2. Find target user
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        // 3. Prevent deactivation of admin accounts
        if (user.role === "ADMIN") {
            throw new Error(
                "Admin account cannot be deactivated."
            );
        }

        // 4. Check whether the user belongs to a team
        const teamMembership =
            await this._teamMemberRepo.findMembershipByUser(userId);

        if (teamMembership) {
            throw new Error(
                "Unable to deactivate this member because they are part of a team."
            );
        }

        // 5. Check active project memberships
        const projectMemberships =
            await this._projectMemberRepo.getProjectsByUser(userId);

        const hasActiveProject = projectMemberships.some(
            (membership) => membership.status === "ACTIVE"
        );

        if (hasActiveProject) {
            throw new Error(
                "Unable to deactivate this member because they are part of a project."
            );
        }

        // 6. Deactivate only if the user has no team or active project membership
        const updatedUser = await this._userRepo.updateStatus(
            userId,
            false
        );

        if (!updatedUser) {
            throw new Error(USER_ERRORS.USER_UPDATE_FAILED);
        }

        return updatedUser;
    }
}
