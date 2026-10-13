export interface OrganizationResponseDTO {
    id: string;
    name: string;
    logo: string | null;
    description: string | null;
    website: string | null;
    createdAt: Date;
    updatedAt: Date;
}