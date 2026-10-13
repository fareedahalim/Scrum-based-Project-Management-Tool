import { inject, injectable } from "tsyringe";
import { ICreateOrganizationUseCase } from "../../interface/organization/ICreateOrganizationUseCase";
import { IOrganizationRepository } from "../../../domain/interfaces/repositories/Organization/IOrganizationRepository";
// import { OrganizationDTO } from "../../dtos/auth/requestDTOs/OrganizationDTO";
import { ORGANIZATION_ERRORS } from "../../../domain/constants/errorMessages";
import { IOrganizationEntity } from "../../../domain/entities/organization/IOrganizationEntity";
// import { OrganizationResponseDTO } from "../../dtos/auth/responseDTOs/OrganizationResponseDTO";
import { MESSAGES } from "../../../domain/constants/messages";
import { OrganizationDTO } from "../../dtos/organization/requestDTOs/OrganizationDTO";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";
@injectable()
export class CreateOrganizationUseCase implements ICreateOrganizationUseCase {
    constructor(
      @inject('IOrganizationRepository') private _createOrganizationRep: IOrganizationRepository,
    ){}

    async execute(dto: OrganizationDTO): Promise<OrganizationResponseDTO> {
        
        const existingOrganization = await this._createOrganizationRep.findOne();

        if(existingOrganization) {
            throw new Error(MESSAGES.ORGANIZATION.ORGANIZATION_SETUP_COMPLETED);
        }

        const organization: IOrganizationEntity = {
            name: dto.name,
            logo: dto.logo,
            description: dto.description,
            website: dto.website,
        };

        const createdOrganization = await this._createOrganizationRep.createOrganization(organization);

        return {
            id: createdOrganization._id!,
            name: createdOrganization.name,
            logo: createdOrganization.logo ?? null,
            description: createdOrganization.description ?? null,
            website: createdOrganization.website ?? null,
            createdAt: createdOrganization.createdAt!,
            updatedAt: createdOrganization.updatedAt!,
        };
    }
}