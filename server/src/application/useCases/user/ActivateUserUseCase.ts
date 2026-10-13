import { inject, injectable } from "tsyringe";
import { IActivateUserUseCase } from "../../interface/user/IActivateUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ActivateUserUseCase implements IActivateUserUseCase {
    constructor(
        @inject('IUserRepository') private _userRepo: IUserRepository,
    ) { }

    async execute(userId: string): Promise<IUserEntity> {

        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        if(user.role === "ADMIN") {
            throw new Error(USER_ERRORS.ADMIN_ACCOUNT_CANNOT_ACTIVATED)
        }

        const updatedUser = await this._userRepo.updateStatus(userId, true);

        if (!updatedUser) {
            throw new Error(USER_ERRORS.USER_UPDATE_FAILED);
        }

        return updatedUser;

    }
} 