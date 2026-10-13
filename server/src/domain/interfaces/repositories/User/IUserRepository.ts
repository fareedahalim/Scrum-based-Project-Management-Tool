import { IUserEntity } from "../../../entities/User/IUserEntity";

export interface IUserRepository {
    findByEmail(email: string): Promise<IUserEntity | null>;
    createUser(user: IUserEntity): Promise<IUserEntity>;
    findById(id: string): Promise<IUserEntity | null>;
    updatedPassword(userID: string , hashedPassword: string) : Promise<void>;

    findAll():Promise<IUserEntity[]>
    updateUser(id: string, data: Partial<IUserEntity>) :Promise<IUserEntity | null>;
    updateStatus(id: string,isActive: boolean): Promise<IUserEntity | null>


}