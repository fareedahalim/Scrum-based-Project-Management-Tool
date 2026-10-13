import { inject, injectable } from "tsyringe";
import { IUpdateOrganizationUseCase } from "../../interface/organization/IUpdateOrganizationUseCase";
import { OrganizationDTO } from "../../dtos/organization/requestDTOs/OrganizationDTO";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";
import { IOrganizationRepository } from "../../../domain/interfaces/repositories/Organization/IOrganizationRepository";
import { ERROR_MESSAGES, ORGANIZATION_ERRORS } from "../../../domain/constants/errorMessages";
import { OrganizationDTOmapper } from "../../mappers/Organization/OrganizationDTOmapper";

@injectable()
export class UpdateOrganizationUseCase implements IUpdateOrganizationUseCase {
    constructor(
        @inject('IOrganizationRepository') private _organizationRepo: IOrganizationRepository,
     
    ){}
    async execute(dto: OrganizationDTO): Promise<OrganizationResponseDTO | null> {
       
        const organization = await this._organizationRepo.findOne();
        if(!organization) {
            throw new Error(ORGANIZATION_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        const updateOrganization = await this._organizationRepo.updateOrganization(dto);
        
        if(!updateOrganization) {
            throw new Error(ORGANIZATION_ERRORS.ORGANIZATION_NOT_FOUND)
        }

        return OrganizationDTOmapper.toOrganizationResponseDTO(updateOrganization)
    }
}