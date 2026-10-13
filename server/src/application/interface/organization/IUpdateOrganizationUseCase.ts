import { OrganizationDTO } from "../../dtos/organization/requestDTOs/OrganizationDTO";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";

export interface IUpdateOrganizationUseCase {
    execute(dto: OrganizationDTO) : Promise<OrganizationResponseDTO | null>
}