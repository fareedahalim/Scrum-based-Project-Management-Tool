import { IOrganizationEntity } from "../../domain/entities/organization/IOrganizationEntity";
import { OrganizationDocument } from "../../infrastructure/database/models/Organization/OrganizationModel";

export class OrganizationMapper {
  static toEntity(
    document: OrganizationDocument
  ): IOrganizationEntity {
    return {
      _id: document._id.toString(),
      name: document.name,
      logo: document.logo,
      description: document.description,
      website: document.website,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}