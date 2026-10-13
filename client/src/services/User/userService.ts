import { AxiosInstance } from "../../axios/axios"
import { API_ROUTES } from "../../constants/apiRoutes"
import type { GetUsersResponse } from "../../types/userTypes";

export const getUsers = async (): Promise<GetUsersResponse> => {
    const response = await AxiosInstance.get<GetUsersResponse>(
        API_ROUTES.USER.GET_ALL
    );

    console.log("getusers api==", response.data);

    return response.data;
};

export const getUserById = async (userId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.USER.GET_BY_ID(userId));
    return response.data

} 


export interface updateUserPayload {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
}
export const updateUser = async(userId: string, data: updateUserPayload) => {
    const response = await AxiosInstance.patch(API_ROUTES.USER.UPDATE(userId),data);
    return response.data; 
}


export const activateUser =  async (userId: string) => {
    const response = await AxiosInstance.patch(API_ROUTES.USER.ACTIVATE(userId));
    return response.data;
} 


export const deactivateUser = async (userId: string) => {
    const response = await AxiosInstance.patch(API_ROUTES.USER.DEACTIVATE(userId));
    return response.data
}