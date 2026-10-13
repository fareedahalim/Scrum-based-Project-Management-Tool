export const ROUTES = {
    AUTH: {
        REGISTER: "/register",
        VERIFY_EMAIL: "/verify-email",
        RESEND_OTP: "/resend-otp",
        LOGIN: "/login",
        REFRESH_TOKEN: "/refresh-token",
        FORGOT_PASSWORD: "/forgot-password",
        VERIFY_RESET_OTP: "/verify-reset-otp",
        RESET_PASSWORD: "/reset-password",
        GOOGLE: "/google",
        GOOGLE_CALLBACK: "/google/callback",
        LOGOUT: "/logout"

    },

    ORGANIZATION: {
        SETUP: "/setup",
        GET: "/",
        UPDATE: "/",
    },

    USER: {
        GET_ALL: "/",
        GET_BY_ID: "/:userId",
        UPDATE: "/:userId",
        ACTIVATE: "/:userId/activate",
        DEACTIVATE: "/:userId/deactivate"
    },

    INVITATION: {
        CREATE_INVITATION: "/",
        ACCEPT_INVITATION: "/accept",
        GET_INVITATIONS: "/",
        RESEND_INVITATION: "/:id/resend",
        CANCEL_INVITATION: "/:id/cancel",
    },

    TEAM: {
        CREATE_TEAM: "/",
        GET_TEAMS: "/",
        GET_TEAM_BY_ID: "/:teamId",
        UPDATE_TEAM: "/:teamId",
        ADD_TEAM_MEMBER: "/:teamId/members",
        REMOVE_TEAM_MEMBER: "/:teamId/members/:userId",
        CHANGE_TEAM_LEAD: "/:teamId/lead",
        GET_TEAM_MEMBERS: "/:teamId/members",
        GET_AVAILABLE_MEMBERS: "/available-members",
        DELETE_TEAM: "/:teamId",
        GET_MY_TEAM: "/my-team",
    },

}