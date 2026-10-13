import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export interface Team {
  id: string;
  name: string;
  description: string;
  lead: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  joinedAt: string;
}

export interface AvailableTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
}

export interface MyTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
}

export interface MyTeam {
  id: string;
  name: string;
  description: string;
  lead: MyTeamMember;
  members: MyTeamMember[];
  createdAt: string;
  updatedAt: string;
}


export interface CreateTeamPayload {
  name: string;
  description: string;
  lead: string;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
}

export interface AddTeamMemberPayload {
  userId: string;
}

export interface ChangeTeamLeadPayload {
  leadId: string;
}


// Create Team
export const createTeam = async (
  data: CreateTeamPayload
): Promise<Team> => {
  const response = await AxiosInstance.post(
    API_ROUTES.TEAM.CREATE_TEAM,
    data
  );

  return response.data.data;
};


// Get Teams
export const getTeams = async (): Promise<Team[]> => {
  const response = await AxiosInstance.get(
    API_ROUTES.TEAM.GET_TEAMS
  );

  return response.data.data;
};


// Get Team By ID
export const getTeamById = async (
  teamId: string
): Promise<Team> => {
  const response = await AxiosInstance.get(
    API_ROUTES.TEAM.GET_TEAM_BY_ID(teamId)
  );

  return response.data.data;
};


// Update Team
export const updateTeam = async (
  teamId: string,
  data: UpdateTeamPayload
): Promise<Team> => {
  const response = await AxiosInstance.patch(
    API_ROUTES.TEAM.UPDATE_TEAM(teamId),
    data
  );

  return response.data.data;
};


// Add Team Member
export const addTeamMember = async (
  teamId: string,
  data: AddTeamMemberPayload
): Promise<void> => {
  await AxiosInstance.post(
    API_ROUTES.TEAM.ADD_TEAM_MEMBER(teamId),
    data
  );
};


// Remove Team Member
export const removeTeamMember = async (
  teamId: string,
  userId: string
): Promise<void> => {
  await AxiosInstance.delete(
    API_ROUTES.TEAM.REMOVE_TEAM_MEMBER(
      teamId,
      userId
    )
  );
};


// Change Team Lead
export const changeTeamLead = async (
  teamId: string,
  data: ChangeTeamLeadPayload
): Promise<void> => {
  await AxiosInstance.patch(
    API_ROUTES.TEAM.CHANGE_TEAM_LEAD(teamId),
    data
  );
};

//get team members

export const getTeamMembers = async (
    teamId: string
): Promise<TeamMember[]> => {
    const response = await AxiosInstance.get(API_ROUTES.TEAM.GET_TEAM_MEMBERS(teamId));

    return response.data.data;
}

//GET AVAILABLE members
export const getAvailableTeamMembers = async (): Promise<AvailableTeamMember[]> => {
  const response = await AxiosInstance.get(
    API_ROUTES.TEAM.GET_AVAILABLE_TEAM_MEMBERS
  );

  return response.data.data;
};


export const deleteTeam = async (
  teamId: string
): Promise<void> => {
  await AxiosInstance.delete(
    API_ROUTES.TEAM.DELETE_TEAM(teamId)
  );
};

// Get My Team
export const getMyTeam = async (): Promise<MyTeam | null> => {
  const response = await AxiosInstance.get(
    API_ROUTES.TEAM.GET_MY_TEAM
  );

  return response.data.data;
};
