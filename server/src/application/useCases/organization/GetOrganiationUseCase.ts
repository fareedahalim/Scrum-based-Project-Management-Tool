import { inject, injectable } from "tsyringe";
import { IGetOrganizationUseCase } from "../../interface/organization/IGetOrganizationUseCase";
import { IOrganizationRepository } from "../../../domain/interfaces/repositories/Organization/IOrganizationRepository";
import { OrganizationResponseDTO } from "../../dtos/organization/responseDTOs/OrganizationResponseDTO";
// import { OrganizationDTO } from "../../dtos/auth/requestDTOs/OrganizationDTO";
// import { OrganizationResponseDTO } from "../../dtos/auth/responseDTOs/OrganizationResponseDTO";
@injectable()
export class GetOrganizationUseCase implements IGetOrganizationUseCase {
    constructor(
        @inject('IOrganizationRepository') private _organizationRepo: IOrganizationRepository,
    ){}

    async execute(): Promise<OrganizationResponseDTO | null> {
        const organization = await this._organizationRepo.findOne();
        if(!organization) {
            return null
        }
         return {
      id: organization._id!,
      name: organization.name,
      logo: organization.logo ?? null,
      description: organization.description ?? null,
      website: organization.website ?? null,
      createdAt: organization.createdAt!,
      updatedAt: organization.updatedAt!,
    };


        
    }
}