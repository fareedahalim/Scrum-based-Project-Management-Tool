export const API_ROUTES = {
    AUTH: {
        REGISTER: "/auth/register",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_OTP: "/auth/resend-otp",
        LOGIN: "/auth/login",
        GOOGLE: "/auth/google",
        REFRESH_TOKEN: "/auth/refresh-token",
        FORGOT_PASSWORD: "/auth/forgot-password",
        VERIFY_RESET_OTP: "/auth/verify-reset-otp",
        RESET_PASSWORD: "/auth/reset-password",
        LOGOUT: "/auth/logout",
    },

    ORGANIZATION: {
        CREATE: '/organization/setup',
        GET: '/organization/',
        UPDATE: '/organization',
    },

    USER: {
        GET_ALL: '/users',
        GET_BY_ID: (userId: string) => `/users/${userId}`,
        UPDATE: (userId: string) => `/users/${userId}`,
        ACTIVATE: (userId: string) => `/users/${userId}/activate`,
        DEACTIVATE: (userId: string) => `/users/${userId}/deactivate`,

    },

    INVITATION: {
        CREATE_INVITATION: "/invitations",
        GET_INVITATIONS: "/invitations",
        ACCEPT_INVITATION: "/invitations/accept",
        RESEND_INVITATION: (id: string) =>
            `/invitations/${id}/resend`,
        CANCEL_INVITATION: (id: string) =>
            `/invitations/${id}/cancel`,
    },

    TEAM: {
        CREATE_TEAM: "/teams",
        GET_TEAMS: "/teams",
        GET_MY_TEAM: "/teams/my-team",
        GET_TEAM_BY_ID: (teamId: string) => `/teams/${teamId}`,
        UPDATE_TEAM: (teamId: string) => `/teams/${teamId}`,
        ADD_TEAM_MEMBER: (teamId: string) => `/teams/${teamId}/members`,
        REMOVE_TEAM_MEMBER: (
            teamId: string,
            userId: string
        ) => `/teams/${teamId}/members/${userId}`,
        CHANGE_TEAM_LEAD: (teamId: string) => `/teams/${teamId}/lead`,
        GET_TEAM_MEMBERS: (teamId: string) =>
            `/teams/${teamId}/members`,

        GET_AVAILABLE_TEAM_MEMBERS: "/teams/available-members",
        DELETE_TEAM: (teamId: string) => `/teams/${teamId}`,
    },

}