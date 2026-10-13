import { inject, injectable } from "tsyringe";

import { IDeactivateUserUseCase } from "../../interface/user/IDeactivateUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class DeactivateUserUseCase implements IDeactivateUserUseCase {
    constructor(
        @inject("IUserRepository")
        private _userRepo: IUserRepository,
    ) {}

    async execute(
        userId: string,
        currentUserId: string
    ): Promise<IUserEntity> {

        // 1. Prevent admin from deactivating their own account
        if (userId === currentUserId) {
            throw new Error("You cannot deactivate your own account.");
        }

        // 2. Find target user
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        if (user.role === "ADMIN") {
            throw new Error("Admin account cannot be deactivated.");
        }

       
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