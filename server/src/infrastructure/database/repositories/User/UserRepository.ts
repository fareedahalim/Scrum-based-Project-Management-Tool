import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { IUserEntity } from "../../../../domain/entities/User/IUserEntity";
import { IUserRepository } from "../../../../domain/interfaces/repositories/User/IUserRepository";
import { Model } from "mongoose";
import { UserDocument, UserModel } from "../../models/User/UserModel";
import { UserMapper } from "../../../mappers/UserMapper";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../../domain/constants/errorMessages";

@injectable()

export class UserRepository extends BaseRepo<IUserEntity> implements IUserRepository {
    constructor() {
        super(UserModel as unknown as Model<IUserEntity>)
    }

    async findByEmail(email: string): Promise<IUserEntity | null> {
        const doc = await UserModel.findOne({ email });
        if (!doc) return null
        return UserMapper.toEntity(doc as unknown as UserDocument);
    }

    async findById(id: string): Promise<IUserEntity | null> {
        const doc = await UserModel.findById(id);
        if (!doc) return null;
        return UserMapper.toEntity(doc as unknown as UserDocument);
    }

    async createUser(user: IUserEntity): Promise<IUserEntity> {
        const id = await super.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            password: user.password,
            googleId: user.googleId,
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            profileImage: user.profileImage,
            lastActive: user.lastActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } as IUserEntity);

        const createdDoc = await super.findById(id);
        if (!createdDoc) throw new Error(USER_ERRORS.USER_CREATION_FAILED);
        return UserMapper.toEntity(createdDoc as unknown as UserDocument);
    }

    async updatedPassword(userID: string, hashedPassword: string): Promise<void> {
        await super.update({
            password: hashedPassword,
            updatedAt: new Date(),
        } as Partial<IUserEntity>, userID);
    }

    async findAll(): Promise<IUserEntity[]> {
        const users = await UserModel.find();
        return users.map((user) =>
            UserMapper.toEntity(user as unknown as UserDocument)
        )

    }

    async updateUser(
        id: string,
        data: Partial<IUserEntity>
    ): Promise<IUserEntity | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                ...data,
                updatedAt: new Date(),
            },
            {
                new: true,
            }
        );

        if (!updatedUser) {
            return null;
        }

        return UserMapper.toEntity(
            updatedUser as unknown as UserDocument
        );
    }

    async updateStatus(id: string, isActive: boolean): Promise<IUserEntity | null> {

        const updatedUser = await UserModel.findByIdAndUpdate(id,
            {
                isActive,
                updatedAt: new Date()
            },
            {
                new: true,
            }
        )

        if (!updatedUser) {
            return null;
        }

        return UserMapper.toEntity(updatedUser as unknown as UserDocument)

    }
}