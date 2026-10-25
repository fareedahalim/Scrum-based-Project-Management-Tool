export interface IRemoveProjectMemberUseCase {
    execute(
        projectId: string,
        userId: string
    ): Promise<boolean>;
}