import { inject, injectable } from "tsyringe";
import { ICreateSprintPlanningUseCase } from "../../interface/meeting/ICreateSprintPlanningMeetingUseCase";
import { ISprintPlanningMeetingRepository } from "../../../domain/interfaces/repositories/Meeting/ISprintPlanningMeetingRepository";
import { IProjectRepository } from "../../../domain/interfaces/repositories/Project/IProjectRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectMember/IProjectMemberRepository";
import { IStoryRepository } from "../../../domain/interfaces/repositories/Story/IStoryRepository";
import { CreateSprintPlanningDTO } from "../../dtos/meeting/requestDTOs/CreateSprintPlanningMeetingDTO";
import { MEETING_ERRORS, PROJECT_ERRORS, STORY_ERRORS } from "../../../domain/constants/errorMessages";
import { ProjectMemberStatus } from "../../../domain/enums/ProjectMemberStatus";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { StoryStatus } from "../../../domain/enums/StoryStatus";
import { ISprintPlanningMeetingEntity } from "../../../domain/entities/Meeting/ISprintPlanningMeetingEntity";
import { MeetingStatus } from "../../../domain/enums/MeetingStatus";
import { INotificationRepository } from "../../../domain/interfaces/repositories/Notification/INotificationRepository";
import { ISocketService } from "../../../domain/interfaces/services/ISocketService";
import { NotificationEventType } from "../../../domain/enums/NotifictionEventType";
import { NotificationType } from "../../../domain/entities/Notification/INotificationEntity";

@injectable()
export class CreateSprintPlanningMeetingUseCase implements ICreateSprintPlanningUseCase {

    constructor(
        @inject('ISprintPlanningMeetingRepository')
        private _meetingRepo: ISprintPlanningMeetingRepository,

        @inject('IProjectMemberRepository')
        private _projectMemberRepository: IProjectMemberRepository,

        @inject('IProjectRepository')
        private _projectRepository: IProjectRepository,

        @inject('IStoryRepository')
        private _storyRepository: IStoryRepository,

        @inject("INotificationRepository")
        private _notificationRepository: INotificationRepository,

        @inject("ISocketService")
        private _socketService: ISocketService,


    ) { }

    async execute(dto: CreateSprintPlanningDTO, userId: string): Promise<string> {
        const project = await this._projectRepository.findById(dto.projectId);

        if (!project) {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }

        const membership = await this._projectMemberRepository.findMembership(dto.projectId, userId);

        if (
            !membership ||
            membership.status !== ProjectMemberStatus.ACTIVE ||
            membership.scrumRole !== ProjectScrumRole.SCRUM_MASTER
        ) {
            throw new Error(MEETING_ERRORS.SCRUM_MASTER_CAN_SCHEDULE_MEETING);
        }

        if (dto.selectedStoryIds.length === 0) {
            throw new Error(MEETING_ERRORS.SELECT_AT_LEAST_ONE);
        }

        for (const storyId of dto.selectedStoryIds) {
            const story = await this._storyRepository.findById(storyId);

            if (!story) {
                throw new Error(`STORY_ERRORS.STORY_NOT_FOUND: ${storyId}`);
            }

            if (story.projectId !== dto.projectId) {
                throw new Error(STORY_ERRORS.SELECTED_STORY_NOT_BELONGS_TO_PROJECT);
            }

            if (story.status !== StoryStatus.READY || story.isArchived) {
                throw new Error(STORY_ERRORS.ONLY_ACTIVE_READY_STORY_SELECTED);
            }
        }

        // 4. Prepare meeting entity
        const meeting: ISprintPlanningMeetingEntity = {
            projectId: dto.projectId,
            title: dto.title,
            meetingDate: dto.meetingDate,
            meetingTime: dto.meetingTime,
            agenda: dto.agenda,
            meetingLink: dto.meetingLink,
            selectedStoryIds: dto.selectedStoryIds,
            status: MeetingStatus.SCHEDULED,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // 5. Save meeting
        const meetingId = await this._meetingRepo.create(meeting);
        const projectMembers =
            await this._projectMemberRepository.getMembersByProject(dto.projectId);

        const recipients = projectMembers.filter(
            (member) =>
                member.status === ProjectMemberStatus.ACTIVE &&
                (
                    member.scrumRole === ProjectScrumRole.PRODUCT_OWNER ||
                    member.scrumRole === ProjectScrumRole.SCRUM_MASTER ||
                    member.scrumRole === ProjectScrumRole.DEVELOPER
                )
        );
        console.log(
            "Meeting notification recipients:",
            recipients.map((member) => ({
                userId: member.userId,
                scrumRole: member.scrumRole,
                status: member.status,
            }))
        );

        for (const recipient of recipients) {
            const notification = await this._notificationRepository.createNotification({
                recipientId: recipient.userId,
                senderId: userId,
                eventType: NotificationEventType.SPRINT_PLANNING_MEETING,
                message: `Sprint Planning meeting for ${project.name} has been scheduled on ${new Date(dto.meetingDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })} at ${dto.meetingTime}.`, resourceId: meetingId,
                resourceType: NotificationType.MEETING,
                isRead: false,
                createdAt: new Date(),
            });

            this._socketService.emitToUser(
                recipient.userId,
                "notification:sprint-planning-meeting",
                notification
            );
        }
        return meetingId;


    }
}