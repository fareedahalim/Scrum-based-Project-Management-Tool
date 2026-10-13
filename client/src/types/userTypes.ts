export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUsersResponse {
  message: string;
  data: User[];
}