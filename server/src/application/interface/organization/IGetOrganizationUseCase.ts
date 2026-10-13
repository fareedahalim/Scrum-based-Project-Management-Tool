

import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";

export interface IGetOrganizationUseCase {
    execute(): Promise<OrganizationResponseDTO | null>
}