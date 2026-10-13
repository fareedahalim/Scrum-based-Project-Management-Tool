import { inject, injectable } from "tsyringe";
import { IGetUsersUseCase } from "../../interface/user/IGetUsersUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";
import { UserMapper } from "../../../infrastructure/mappers/UserMapper";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(
        @inject('IUserRepository') private _userRepository: IUserRepository,
    ){}

    async execute(): Promise<UserResponseDTO[]> {
    const users = await this._userRepository.findAll();

    return users.map((user) =>
      UserMapper.toResponse(user)
    );
  }
}