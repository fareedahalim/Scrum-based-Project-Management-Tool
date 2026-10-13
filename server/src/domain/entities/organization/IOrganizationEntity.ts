export interface IOrganizationEntity {
  _id?: string;

  name: string;

  logo?: string;

  description?: string;

  website?: string;

  createdAt?: Date;

  updatedAt?: Date;
}