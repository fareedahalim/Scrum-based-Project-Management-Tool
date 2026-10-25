
import { IProjectMemberEntity } from "../../../entities/ProjectMember/IProjectMemberEntity";

export interface IProjectMemberRepository {
  addMember(
    projectMember: IProjectMemberEntity
  ): Promise<IProjectMemberEntity>;

  findMembership(
    projectId: string,
    userId: string
  ): Promise<IProjectMemberEntity | null>;

  getMembersByProject(
    projectId: string
  ): Promise<IProjectMemberEntity[]>;

  getProjectsByUser(
    userId: string
  ): Promise<IProjectMemberEntity[]>;

  updateMembership(
    projectId: string,
    userId: string,
    data: Partial<IProjectMemberEntity>
  ): Promise<IProjectMemberEntity | null>;

  removeMember(
    projectId: string,
    userId: string
  ): Promise<boolean>;
}
