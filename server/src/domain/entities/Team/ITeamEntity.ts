export interface ITeamEntity {
    _id?: string;
    name: string;
    description: string;
    lead: string;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}