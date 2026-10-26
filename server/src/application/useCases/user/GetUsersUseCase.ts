
import { inject, injectable } from "tsyringe";
import { IGetUsersUseCase } from "../../interface/user/IGetUsersUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import type { UserSearchParams } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";
import { UserMapper } from "../../../infrastructure/mappers/UserMapper";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(
        @inject("IUserRepository")
        private _userRepository: IUserRepository
    ) {}

    async execute(params: UserSearchParams) {
        const result = await this._userRepository.findUsers(params);

        return {
            users: result.users.map((user) =>
                UserMapper.toResponse(user)
            ),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}
