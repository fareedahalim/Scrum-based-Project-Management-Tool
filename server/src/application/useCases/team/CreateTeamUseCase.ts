import { inject, injectable } from "tsyringe";
import { ICreateTeamUseCase } from "../../interface/team/ICreateTeamUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { CreateTeamDTO } from "../../dtos/team/requestDTOs/CreateTeamDTO";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";
import { ERROR_MESSAGES, TEAM_ERRORS } from "../../../domain/constants/errorMessages";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ITeamEntity } from "../../../domain/entities/Team/ITeamEntity";
import { ITeamMemberEntity } from "../../../domain/entities/TeamMember/ITeamMemberEntity";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { UserRoles } from "../../../domain/enums/UserRole";

@injectable()
export class CreateTeamUseCase implements ICreateTeamUseCase {
    constructor(
        @inject('ITeamRepository') private _teamRepo: ITeamRepository,
        @inject('IUserRepository') private _userRepo: IUserRepository,
        @inject('ITeamMemberRepository') private _teamMemberRepo: ITeamMemberRepository,
    ){}

    async execute(dto: CreateTeamDTO): Promise<TeamResponseDTO> {
        const name = dto.name.trim();
        
        if(!name) {
            throw new Error(TEAM_ERRORS.TEAM_NAME_REQUIRED);
        }

        const description = dto.description.trim();

        if(!description) {
            throw new Error(TEAM_ERRORS.TEAM_DESCRIPTION_REQUIRED)
        }

        const existingTeam = await this._teamRepo.findByName(name);

        if(existingTeam) {
            throw new Error(TEAM_ERRORS.TEAM_ALREADY_EXISTS)
        }

        const leadUser = await this._userRepo.findById(dto.lead)

        if(!leadUser) {
            throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
        }

        if (leadUser.role !== UserRoles.MEMBER) {
    throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
}

const assignedUserIds =
    await this._teamMemberRepo.getAssignedUserIds();

if (assignedUserIds.includes(leadUser._id!)) {
    throw new Error(TEAM_ERRORS.TEAM_LEAD_NOT_FOUND);
}

        
const team: ITeamEntity = {
    name,
    description,
    lead: dto.lead,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

        const createdTeam = await this._teamRepo.createTeam(team);

        const teamMember: ITeamMemberEntity = {
            teamId: createdTeam._id!,
            userId: dto.lead,
            joinedAt: new Date(),
        }
        await this._teamMemberRepo.addMember(teamMember);

        return {
  id: createdTeam._id!,
  name: createdTeam.name,
  description: createdTeam.description,
  lead: {
    id: createdTeam.lead,
    firstName: leadUser.firstName,
    lastName: leadUser.lastName,
  },
  createdAt: createdTeam.createdAt,
  updatedAt: createdTeam.updatedAt,
};
    }
    
}