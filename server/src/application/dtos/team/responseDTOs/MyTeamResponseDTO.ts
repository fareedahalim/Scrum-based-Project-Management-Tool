export interface MyTeamMemberDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
}

export interface MyTeamResponseDTO {
    id: string;
    name: string;
    description: string;
    lead: MyTeamMemberDTO;
    members: MyTeamMemberDTO[];
    createdAt: Date;
    updatedAt: Date;
}