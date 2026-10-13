import { OrganizationDTO } from "../../../../application/dtos/organization/requestDTOs/OrganizationDTO";
import { IOrganizationEntity } from "../../../entities/organization/IOrganizationEntity";

export interface IOrganizationRepository {
    createOrganization(organization: IOrganizationEntity): Promise<IOrganizationEntity>;

  findOne(): Promise<IOrganizationEntity | null>;

  updateOrganization(organization: OrganizationDTO): Promise<IOrganizationEntity | null>;

}
