import { inject, injectable } from "tsyringe";
import { IGetUserByIdUseCase } from "../../interface/user/IGetUserByIdUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
    constructor(
        @inject('IUserRepository') private _userRepo: IUserRepository,
    ){}
    async execute(userId: string): Promise<IUserEntity> {
        const user = await this._userRepo.findById(userId);
        if(!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }
}