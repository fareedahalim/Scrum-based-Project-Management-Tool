
import { IUserEntity } from "../../../entities/User/IUserEntity";

export interface UserSearchParams {
    search?: string;
    role?: IUserEntity["role"];
    status?: "ACTIVE" | "INACTIVE";
    page: number;
    limit: number;
}

export interface PaginatedUsers {
    users: IUserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IUserRepository {
    findByEmail(email: string): Promise<IUserEntity | null>;
    createUser(user: IUserEntity): Promise<IUserEntity>;
    findById(id: string): Promise<IUserEntity | null>;
    updatedPassword(userID: string, hashedPassword: string): Promise<void>;

    // Keep this method if other parts of your backend use it.
    findAll(): Promise<IUserEntity[]>;

    // New method for backend search, filters, and pagination.
    findUsers(
        params: UserSearchParams
    ): Promise<PaginatedUsers>;

    updateUser(
        id: string,
        data: Partial<IUserEntity>
    ): Promise<IUserEntity | null>;

    updateStatus(
        id: string,
        isActive: boolean
    ): Promise<IUserEntity | null>;
}
