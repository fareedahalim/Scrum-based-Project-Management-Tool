
import { injectable } from "tsyringe";
import { EpicModel } from "../../models/Epic/EpicModel";
import { IStoryEntity } from "../../../../domain/entities/Story/IStoryEntity";
import { IStoryRepository } from "../../../../domain/interfaces/repositories/Story/IStoryRepository";
import { StoryFilter, PaginatedStories } from "../../../../domain/interfaces/repositories/Story/StoryFilter";

import { StoryModel } from "../../models/Story/StoryModel";
import { StoryMapper } from "../../../mappers/StoryMapper";

const escapeRegex = (value: string): string => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


@injectable()
export class StoryRepository implements IStoryRepository {
  async createStory(story: IStoryEntity): Promise<IStoryEntity> {
    const doc = await StoryModel.create({
      projectId: story.projectId,
      epicId: story.epicId,
      key: story.key.trim().toUpperCase(),
      title: story.title,
      description: story.description,
      priority: story.priority,
      storyPoints: story.storyPoints,
      status: story.status,
      acceptanceCriteria: story.acceptanceCriteria,
      labels: story.labels,
      isArchived: false,
      archivedAt: null,
      createdBy: story.createdBy,
      updatedBy: story.updatedBy,
    });

    return StoryMapper.toEntity(doc);
  }

  async findById(storyId: string): Promise<IStoryEntity | null> {
    const doc = await StoryModel.findById(storyId);

    return doc ? StoryMapper.toEntity(doc) : null;
  }

  async findByKey(
    projectId: string,
    key: string
  ): Promise<IStoryEntity | null> {
    const doc = await StoryModel.findOne({
      projectId,
      key: key.trim().toUpperCase(),
    });

    return doc ? StoryMapper.toEntity(doc) : null;
  }

 
async getStoriesByProject(
    projectId: string,
    filters: StoryFilter = {},
): Promise<PaginatedStories> {
    const {
        search,
        status,
        epicId,
        includeArchived = false,
    } = filters;

    const page = Math.max(
        1,
        Math.floor(filters.page ?? 1),
    );

    const limit = Math.min(
        100,
        Math.max(1, Math.floor(filters.limit ?? 10)),
    );

    const mongoFilter: Record<string, any> = {
        projectId,
    };

    // Archived stories are excluded by default.
    if (!includeArchived) {
        mongoFilter.isArchived = false;
    }

    // Apply an optional story status filter.
    if (status) {
        mongoFilter.status = status;
    }

    // Apply an optional epic filter.
    if (epicId) {
        mongoFilter.epicId = epicId;
    }

    const trimmedSearch = search?.trim();

    if (trimmedSearch) {
        const searchRegex = new RegExp(
            escapeRegex(trimmedSearch),
            "i",
        );

        // Find non-archived epics matching the search.
        const matchingEpics = await EpicModel.find({
            projectId,
            isArchived: false,
            $or: [
                { name: searchRegex },
                { key: searchRegex },
                { description: searchRegex },
            ],
        })
            .select("_id")
            .exec();

        const matchingEpicIds = matchingEpics.map(
            (epic) => epic._id,
        );

        // Match story fields OR stories belonging to a
        // matching epic.
        mongoFilter.$or = [
            { title: searchRegex },
            { key: searchRegex },
            { description: searchRegex },
            { labels: searchRegex },
            ...(matchingEpicIds.length > 0
                ? [{ epicId: { $in: matchingEpicIds } }]
                : []),
        ];
    }

    const skip = (page - 1) * limit;

    const [docs, totalStories] = await Promise.all([
        StoryModel.find(mongoFilter)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),

        StoryModel.countDocuments(mongoFilter).exec(),
    ]);

    const totalPages = Math.ceil(totalStories / limit);

    return {
        stories: docs.map((doc) =>
            StoryMapper.toEntity(doc),
        ),
        pagination: {
            page,
            limit,
            totalStories,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1 && totalPages > 0,
        },
    };
}


  async getStoriesByEpic(
    epicId: string,
    includeArchived = false
  ): Promise<IStoryEntity[]> {
    const filter: {
      epicId: string;
      isArchived?: boolean;
    } = { epicId };

    if (!includeArchived) {
      filter.isArchived = false;
    }

    const docs = await StoryModel.find(filter).sort({
      createdAt: -1,
    });

    return docs.map((doc) => StoryMapper.toEntity(doc));
  }

  async updateStory(
    storyId: string,
    updates: Partial<IStoryEntity>
  ): Promise<IStoryEntity | null> {
    const allowedUpdates: Partial<IStoryEntity> = {};

    if (updates.epicId !== undefined) {
      allowedUpdates.epicId = updates.epicId;
    }

    if (updates.title !== undefined) {
      allowedUpdates.title = updates.title;
    }

    if (updates.description !== undefined) {
      allowedUpdates.description = updates.description;
    }

    if (updates.priority !== undefined) {
      allowedUpdates.priority = updates.priority;
    }

    if (updates.storyPoints !== undefined) {
      allowedUpdates.storyPoints = updates.storyPoints;
    }

    if (updates.status !== undefined) {
      allowedUpdates.status = updates.status;
    }

    if (updates.acceptanceCriteria !== undefined) {
      allowedUpdates.acceptanceCriteria = updates.acceptanceCriteria;
    }

    if (updates.labels !== undefined) {
      allowedUpdates.labels = updates.labels;
    }

    if (updates.updatedBy !== undefined) {
      allowedUpdates.updatedBy = updates.updatedBy;
    }

    const doc = await StoryModel.findByIdAndUpdate(
      storyId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    return doc ? StoryMapper.toEntity(doc) : null;
  }

  async archiveStory(
    storyId: string,
    archivedBy: string
  ): Promise<IStoryEntity | null> {
    const doc = await StoryModel.findByIdAndUpdate(
      storyId,
      {
        $set: {
          isArchived: true,
          archivedAt: new Date(),
          updatedBy: archivedBy,
        },
      },
      { new: true, runValidators: true }
    );

    return doc ? StoryMapper.toEntity(doc) : null;
  }
}
