import { inject, injectable } from "tsyringe";
import { IUpdateOrganizationUseCase } from "../../interface/organization/IUpdateOrganizationUseCase";
import { IUpdateUserUseCase } from "../../interface/user/IUpdateUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { UpdatedUserDTO } from "../../dtos/user/requestDTOs/UpdatedUserDTO";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class UpdatedUserUseCase implements IUpdateUserUseCase {
    constructor(
        @inject('IUserRepository') private _userRepo: IUserRepository,
    ){}

    async execute(dto: UpdatedUserDTO): Promise<IUserEntity> {
        const user = await this._userRepo.findById(dto.userId);

        if(!user){
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        const updatedUser = await this._userRepo.updateUser(dto.userId,{
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            profileImage: dto.profileImage
        });

        if(!updatedUser) {
            throw new Error(USER_ERRORS.USER_UPDATE_FAILED)
        }

        return updatedUser;
    }
}