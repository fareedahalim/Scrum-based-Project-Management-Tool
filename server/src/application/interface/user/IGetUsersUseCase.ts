
import type {
    UserSearchParams,
    PaginatedUsers,
} from "../../../domain/interfaces/repositories/User/IUserRepository";

import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";

export interface IGetUsersUseCase {
    execute(
        params: UserSearchParams
    ): Promise<{
        users: UserResponseDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
