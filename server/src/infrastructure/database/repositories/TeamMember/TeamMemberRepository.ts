import { injectable } from "tsyringe";

import { ITeamMemberEntity } from "../../../../domain/entities/TeamMember/ITeamMemberEntity";
import { ITeamMemberRepository } from "../../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { TeamMemberModel } from "../../models/Team/TeamMemberModel";
import { TeamMemberMapper } from "../../../mappers/TeamMemberMapper";
import { TeamModel } from "../../models/Team/TeamModel";
import { ITeamEntity } from "../../../../domain/entities/Team/ITeamEntity";
import { TeamMapper } from "../../../mappers/TeamMapper";


@injectable()
export class TeamMemberRepository
    implements ITeamMemberRepository {
    async addMember(
        teamMember: ITeamMemberEntity
    ): Promise<ITeamMemberEntity> {
        const createdMember =
            await TeamMemberModel.create({
                teamId: teamMember.teamId,
                userId: teamMember.userId,
                joinedAt:
                    teamMember.joinedAt ?? new Date(),
            });

        return TeamMemberMapper.toEntity(
            createdMember
        );
    }


    async findMembership(
        teamId: string,
        userId: string
    ): Promise<ITeamMemberEntity | null> {
        const activeTeam = await TeamModel.exists({
            _id: teamId,
            isDeleted: false,
        });

        if (!activeTeam) {
            return null;
        }

        const membership = await TeamMemberModel.findOne({
            teamId,
            userId,
        });

        if (!membership) {
            return null;
        }

        return TeamMemberMapper.toEntity(membership);
    }


   
async findMembershipByUser(
    userId: string
): Promise<ITeamMemberEntity | null> {
    const activeTeams = await TeamModel.find({
        isDeleted: false,
    }).select("_id");

    const activeTeamIds = activeTeams.map(
        (team) => team._id
    );

    if (activeTeamIds.length === 0) {
        return null;
    }

    const membership = await TeamMemberModel.findOne({
        userId,
        teamId: { $in: activeTeamIds },
    });

    if (!membership) {
        return null;
    }

    return TeamMemberMapper.toEntity(membership);
}

    async getMembersByTeam(
        teamId: string
    ): Promise<ITeamMemberEntity[]> {
        const activeTeam = await TeamModel.exists({
            _id: teamId,
            isDeleted: false,
        });

        if (!activeTeam) {
            return [];
        }

        const memberships = await TeamMemberModel.find({
            teamId,
        });

        return memberships.map((membership) =>
            TeamMemberMapper.toEntity(membership)
        );
    }

    async removeMember(
        teamId: string,
        userId: string
    ): Promise<boolean> {
        const result =
            await TeamMemberModel.deleteOne({
                teamId,
                userId,
            });

        return result.deletedCount > 0;
    }

    async getTeamsByUser(
        userId: string
    ): Promise<ITeamEntity[]> {
        const memberships = await TeamMemberModel.find({
            userId,
        });

        const teamIds = memberships.map(
            (membership) => membership.teamId
        );

        const teams = await TeamModel.find({
            _id: { $in: teamIds },
            isDeleted: false,
        });

        return teams.map((team) =>
            TeamMapper.toEntity(team)
        );
    }


    async getAssignedUserIds(): Promise<string[]> {
        const activeTeams = await TeamModel.find({
            isDeleted: false,
        }).select("_id");

        const activeTeamIds = activeTeams.map(
            (team) => team._id
        );

        const memberships = await TeamMemberModel.find({
            teamId: { $in: activeTeamIds },
        }).select("userId");

        return [
            ...new Set(
                memberships.map((membership) =>
                    membership.userId.toString()
                )
            ),
        ];
    }

    async getAssignedUserIdsByTeam(
    teamId: string
): Promise<string[]> {
    const activeTeam = await TeamModel.exists({
        _id: teamId,
        isDeleted: false,
    });

    if (!activeTeam) {
        return [];
    }

    const memberships = await TeamMemberModel.find({
        teamId,
    }).select("userId");

    return [
        ...new Set(
            memberships.map((membership) =>
                membership.userId.toString()
            )
        ),
    ];
}
}