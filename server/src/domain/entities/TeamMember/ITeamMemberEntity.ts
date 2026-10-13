export interface ITeamMemberEntity {
    _id?: string;
    teamId: string;
    userId: string;
    joinedAt: Date;
}