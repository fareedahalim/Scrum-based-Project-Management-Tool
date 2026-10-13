import { IOrganizationEntity } from "../../../domain/entities/organization/IOrganizationEntity";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";

export class OrganizationDTOmapper {
    static toOrganizationResponseDTO(
        organization: IOrganizationEntity
    ): OrganizationResponseDTO {
        return {
            id: organization._id!,
            name: organization.name,
            logo: organization.logo ?? null,
            description: organization.description ?? null,
            website: organization.website ?? null,
            createdAt: organization.createdAt!,
            updatedAt: organization.updatedAt!,


        }
    }
}