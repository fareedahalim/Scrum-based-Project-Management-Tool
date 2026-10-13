import { OrganizationDTO } from "../../dtos/organization/requestDTOs/OrganizationDTO";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";


export interface ICreateOrganizationUseCase {
    execute(dto: OrganizationDTO): Promise<OrganizationResponseDTO>;
}