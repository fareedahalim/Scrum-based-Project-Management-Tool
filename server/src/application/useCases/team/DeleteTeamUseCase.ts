import { inject, injectable } from "tsyringe";
import { IDeleteTeamUseCase } from "../../interface/team/IDeleteTeamUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";
@injectable()
export class DeleteTeamUseCase implements IDeleteTeamUseCase {
    constructor(
        @inject('ITeamRepository') private _teamRepo: ITeamRepository,

    ) { }

    async execute(teamId: string): Promise<void> {

        const existingTeam = await this._teamRepo.findById(teamId);

        if (!existingTeam || existingTeam.isDeleted) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
        }

        const deleted = await this._teamRepo.deleteTeam(teamId);

        if (!deleted) {
            throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);

        }
    }
}