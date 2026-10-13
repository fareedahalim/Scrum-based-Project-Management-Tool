import { injectable } from "tsyringe";

import { BaseRepo } from "../base/BaseRepo";

import {
  OrganizationDocument,
  OrganizationModel,
} from "../../models/Organization/OrganizationModel";

import { IOrganizationRepository } from "../../../../domain/interfaces/repositories/Organization/IOrganizationRepository";

import { IOrganizationEntity } from "../../../../domain/entities/organization/IOrganizationEntity";

import { ORGANIZATION_ERRORS } from "../../../../domain/constants/errorMessages";

import { OrganizationMapper } from "../../../mappers/OrganizationMapper";
import { OrganizationDTO } from "../../../../application/dtos/organization/requestDTOs/OrganizationDTO";

@injectable()
export class OrganizationRepository
  extends BaseRepo<OrganizationDocument>
  implements IOrganizationRepository
{
  constructor() {
    super(OrganizationModel);
  }

  async createOrganization(
    organization: IOrganizationEntity
  ): Promise<IOrganizationEntity> {
    const _id = await super.create({
      name: organization.name,
      logo: organization.logo,
      description: organization.description,
      website: organization.website,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    } as OrganizationDocument);

    const createdDoc = await super.findById(_id);

    if (!createdDoc) {
      throw new Error(
        ORGANIZATION_ERRORS.ORGANIZATION_CREATION_FAILED
      );
    }

    return OrganizationMapper.toEntity(createdDoc);
  }

  
  
  async findOne(): Promise<IOrganizationEntity | null> {
    const organization = await this.model.findOne();

    if (!organization) {
      return null;
    }

    return OrganizationMapper.toEntity(organization);
  }


  async updateOrganization(organization: OrganizationDTO): Promise<IOrganizationEntity | null> {

    const response = await this.model.findOneAndUpdate(
        {}, organization,{
            new: true,
            runValidators: true,
        }
    );

    if(!response) {
        return null;
    }
    return OrganizationMapper.toEntity(response)
      
  }

}