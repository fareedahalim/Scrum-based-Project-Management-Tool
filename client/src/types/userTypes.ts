
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

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersResponse {
  message: string;
  data: User[];
  pagination: UserPagination;
}

export interface GetUsersParams {
  search?: string;
  role?: "ADMIN" | "MEMBER" | "ALL";
  status?: "ACTIVE" | "INACTIVE" | "ALL";
  page: number;
  limit: number;
}
