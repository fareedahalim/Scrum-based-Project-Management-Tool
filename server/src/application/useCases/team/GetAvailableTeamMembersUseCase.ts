import { inject, injectable } from "tsyringe";
import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IGetAvailableTeamMembersUseCase } from "../../interface/team/IGetAvailableTeamMeamberUseCase";
import { UserRoles } from "../../../domain/enums/UserRole";

@injectable()
export class GetAvailableTeamMembersUseCase
  implements IGetAvailableTeamMembersUseCase
{
  constructor(
    @inject("IUserRepository")
    private _userRepo: IUserRepository,

    @inject("ITeamMemberRepository")
    private _teamMemberRepo: ITeamMemberRepository
  ) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this._userRepo.findAll();

    
const assignedUserIds =
    await this._teamMemberRepo.getAssignedUserIds();

const assignedUserIdSet = new Set(assignedUserIds);

const availableUsers = users.filter(
    (user) =>
        user.role === UserRoles.MEMBER &&
        user._id &&
        !assignedUserIdSet.has(user._id.toString())
);

    return availableUsers.map((user) => ({
      id: user._id!,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      profileImage: user.profileImage ?? undefined,
    }));
  }
}