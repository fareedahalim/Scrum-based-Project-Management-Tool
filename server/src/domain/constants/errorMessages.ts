export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: "Invalid email or password",
    // OTP_MISSING: "OTP expired or OTP not found",
    // DATA_MISSING: "Data is missing check email, userName and password",
    // OTP_VERIFICATION_FAILED: "Otp verification failed",
    // OTP_ERROR: "Error while sending otp",
    INVALID_OTP: "Invalid otp",
    INVALID_TOKEN: "Invalid token",
    UNAUTHORIZED: "Unauthorized",
    TOKEN_REVOKED: "Token is revoked",
    REFRESH_TOKEN_MISSING: "Refresh Token missing !",
    REFRESH_TOKEN_EXPIRED: "Refresh Token expired !",
    PASSWORD_NOT_MATCHING: "Password not matching",
    FORBIDDEN: "You do not have permission to perform this action",

    // OTP_RESEND_ERROR: "Error while resending otp",
    // INVALID_EMAIL: "Please provide a valid email",
    // PASSWORD_REQUIRED: "Password required",
    // INVALID_USERDATA: "Invalid user data",
    // INVALID_DATA: "Invalid data format",
    // OTP_EXPIRED: "Otp expired or invalid otp",
    // TOKEN_EXPIRED: "Token expired",
    // TOKEN_MISMATCH: "Token not matching",
    // INVALID_PAGINATION_PARAMETERS: "Invalid pagination parameters",
    // FAILED_USER_FETCHING: "Failed to Fetch Users",
    // INVALID_TOKEN: "Invalid Token !",
    // ERROR_IN_LOGOUT: "Error while logging out !",
    // ERROR_CREATING_ACCESS_TOKEN: "Error while creating access token !",
    // ERROR_IN_RESETING_PASSWORD: "Error while reseting password !",
    // INTERNAL_SERVER_ERROR: "Internal Server Error",
    // AUTHENTICATION_CODE_MISSING: "Authentication code missing",
    // INVALID_ROLE: "Invalid role !",
    // TOKEN_DATA_MISSING: "Token data is missing",
    // INVALID_LOGIN_TYPE: "Invalid login type",

    // ACCESS_TOKEN_MISSING: "Access Token missing !",
    // ACCESS_TOKEN_CREATION_FAILED: "Failed to create access token",
    // REFRESH_TOKEN_CREATION_FAILED: "Failed to create refresh token",
    // ACCESS_TOKEN_SECRETKEY_MISSING: "Access token secret key not found",
    // REFRESH_TOKEN_SECRETKEY_MISSING: "Refresh token secret key not found",
    // UPLOAD_ERROR: "Error while uploading",
    // NOT_AUTHORIZED: "Your are not authorized !",
    // INVALID_GOOGLE_TOKEN: "Invalid Google Token",


    // AUTHENTICATION_FAILED: "Authentication failed",
    // GOOGLE_LOGIN_FAILED: "Google login failed",
    // JWT_SECRET_MISSING: 'Missing JWT secrets: set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET',
    // ADMIN_LOGIN_NOT_ALLOWED: 'Admin login not allowed',
    // BAD_REQUEST: "Bad Request",
    // INVALID_REQUEST: "Invalid Request",
    // SPRINT_ACTIVE: 'cannot delete active sprints',
    // INVALID_DATES: 'Invalid dates',
    // DATE_REQUIRED: 'Date required',
    // YOU_ARE_NOT_AUTHORIZED: "You can't update this issue",
    // ONLY_PM_CAN_MOVE_ISSUE: "Only Project Manager can move the issue",
};
export const USER_ERRORS = {
    USER_ALREADY_EXISTS: "User with this email already exists",
    USER_CREATION_FAILED: "User creation failed",
    USER_NOT_FOUND: "User Not Found",
    USER_NOT_ACTIVE: "User is not active or the admin blocked this user",
    USER_EMAIL_NOT_VERIFIED: "User email is not verified ",
    USER_ID_MISSING: "User id is missing",
    USER_UPDATE_FAILED: "User updation is become failed",
    USER_DEACTIVATION_FAILED: "User Deactivation failed",
    USER_ACTIVATION_FAILED: "User Activation Failed",
    USER_UPDATION_FAILED: "User Updation Failed",
    USER_FETCH_FAILED: "User feching is failed",
    USERS_FETCH_FAILED: "Users feching is failed",
    ADMIN_ACCOUNT_CANNOT_ACTIVATED: "Admin account cannot be activated through user management.",
    UNAUTHORIZED: "Unauthorized",
};

export const ORGANIZATION_ERRORS = {
    ORGANIZATION_CREATION_FAILED: "Organization creation failed",
    ORGANIZATION_NOT_FOUND: "Organization not found",
    ORGANIZATION_FETCHED_FAILED: "Failed to fetch organization",
    ORGANIZATION_UPDATION_FAILED: "Organization updation is become failed",
}

export const INVITATION_ERRORS = {
    PENDING_INVITATION_EXIST: "A pending invitation already exists for this email",
    INVITATION_INVALID_OR_EXPIRED: "Invitation is become invalid or expired",
    INVITATION_NOT_FOUND: "Invitation is not found",
    INVITATION_ALREADY_PROCESSED: "Invitation is already processed",
    INVITATION_EXPIRED: "Invitation Expired",
    INVITATION_INVALID: "Invitation is invalid",
    INVITATION_ACCEPTED_SUCCESSFULLY: "Invitation accepted Successfully"

}

export const TEAM_ERRORS = {
    TEAM_NAME_REQUIRED: "Team name is required",
    TEAM_DESCRIPTION_REQUIRED: "Team Description is required",
    TEAM_ALREADY_EXISTS: "A team with this name already exists",
    TEAM_LEAD_NOT_FOUND: "Team lead not found",
    TEAM_ACCESS_DENIED: "You do not have access to this team",
    TEAM_NOT_FOUND: "Team not found",
    TEAM_MEMBER_ALREADY_EXISTS: "User is already a member of this team",
    TEAM_MEMBER_NOT_FOUND: "User is not a member of this team",
    TEAM_LEAD_CANNOT_BE_REMOVED: "Team lead cannot be removed. Assign another team lead first",
    TEAM_LEAD_MUST_BE_MEMBER: "Team lead must be a member of the team",
    TEAM_LEAD_ALREADY_ASSIGNED: "This user is already the team lead",
    TEAM_CREATION_FAILED: "Team  creation failed",
    TEAMS_FETCH_FAILED: "Teams fetch is become failed",
    TEAM_FETCH_FAILED: "Team fetch is become failed",
    TEAM_UPDATION_FAILED: "Team updation failed",
    TEAM_MEMBER_ADD_FAILED: "Team member adding is become failure",
    TEAM_MEMBER_REMOVE_FAILED: "Team member removal become failed",
    TEAM_LEAD_CHANGE_FAILED: " can not change the team lead",
    USER_ALREADY_BELONGS_TO_TEAM: "This user already belongs to another team",

}

export const PROJECT_ERRORS = {
    PROJECT_NAME_REQUIRED: "Project name is missing",
    PROJECT_KEY_REQUIRED: "Project key is missing",
    PROJECT_ALREADY_EXISTS: "A project with the same key already exists",
    PROJECT_NOT_FOUND: 'The project does not exist or is unavailable',
    PROJECT_CREATION_FAILED: "Project creation failed",
    PROJECTS_FETCH_FAILED: "Fetching projects failed",
    PROJECT_FETCH_FAILED: "Fetching one project failed",
    PROJECT_UPDATION_FAILED: "Updating a project failed",
    ARCHIEVED_PROJECT_CAN_NOT_UPDATE: "Archived projects cannot be updated.",
    PROJECT_ACCESS_DENIED: "User does not have permission to access the project",
    PROJECT_ARCHIVE_FAILED: "Archiving the project failed",
    PROJECT_ALREADY_ARCHIEVED:"Project is already archived.",
    PROJECT_TEAM_NOT_FOUND: "The assigned team does not exist",
    PROJECT_MEMBER_ALREADY_EXISTS: "User is already assigned to the project",
    PROJECT_MEMBER_NOT_FOUND: "User is not a member of the project",
    PROJECT_MEMBER_ASSIGNMENT_FAILED: "Assigning a project member failed",
    PROJECT_CREATOR_INVALID: "Creator missing or inactive",
    PROJECT_TEAM_ALREADY_ASSIGNED: "Team already assigned to an unfinished project",
    PROJECT_ROLE_ASSIGNMENT_CONFLICT: "Product Owner and Scrum Master are the same user",
    PROJECT_ADDITIONAL_DUPLICATE_MEMBER_NOT_ALLOWED:"Duplicate additional member IDs are not allowed",
    PROJECT_PRODUCT_OWNER_SCRUM_MASTER_NOT_REPEATED_AS_ADDITIONAL_MEMBERS: "Product Owner and Scrum Master must not be repeated as additional members.",
    PROJECT_END_DATE_CAN_NOT_EARLIER_THAN_START_DATE: "End date cannot be earlier than start date."



}


export const EPIC_ERRORS = {
    EPIC_NOT_FOUND: "Epic not found.",
    EPIC_CREATION_FAILED: "Failed to create epic.",
    EPIC_FETCH_FAILED: "Failed to fetch epic.",
    EPICS_FETCH_FAILED: "Failed to fetch epics.",
    EPIC_UPDATION_FAILED: "Failed to update epic.",
    EPIC_ARCHIVE_FAILED: "Failed to archive epic.",
    EPIC_ALREADY_ARCHIVED: "Epic is already archived.",
    EPIC_TITLE_REQUIRED: "Epic title is required.",
    EPIC_PROJECT_NOT_FOUND: "Project not found.",
};

export const STORY_ERRORS = {
    STORY_NOT_FOUND: "Story not found.",
    STORY_CREATION_FAILED: "Failed to create story.",
    STORIES_FETCH_FAILED: "Failed to fetch stories.",
    STORY_UPDATION_FAILED: "Failed to update story.",
    STORY_ARCHIVE_FAILED: "Failed to archive story.",
    STORY_ALREADY_ARCHIVED: "Story is already archived.",
    STORY_TITLE_REQUIRED: "Story title is required.",
    STORY_DESCRIPTION_REQUIRED: "Story description is required.",
    STORY_POINTS_INVALID:
        "Story points must be 1, 2, 3, 5, 8, 13, or 21.",
    STORY_PROJECT_NOT_FOUND: "Project not found.",
    STORY_EPIC_NOT_FOUND: "Epic not found.",
    STORY_EPIC_PROJECT_MISMATCH:
        "Story's epic does not belong to its project.",
    STORY_ARCHIVED_EPIC_NOT_ALLOWED:
        "Cannot update a story under an archived epic.",
    STORY_CREATE_UNDER_ARCHIVED_EPIC:
        "Cannot create a story under an archived epic.",
        
};
