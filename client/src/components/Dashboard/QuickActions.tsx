import {
  FolderPlus,
  UserPlus,
  Users,
  UserCog,
} from "lucide-react";

const QuickActions = () => {
  const handleCreateProject = () => {
    // Navigate to create project page later
  };

  const handleCreateTeam = () => {
    // Navigate to create team page later
  };

  const handleInviteUser = () => {
    // Navigate to invite user page later
  };

  const handleManageRoles = () => {
    // Navigate to roles page later
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <button
        onClick={handleCreateProject}
        className="flex items-center gap-3 rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
      >
        <FolderPlus size={20} />
        <div>
          <p className="font-medium">Create Project</p>
          <p className="text-xs text-gray-500">
            Start a new project
          </p>
        </div>
      </button>

      <button
        onClick={handleCreateTeam}
        className="flex items-center gap-3 rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
      >
        <Users size={20} />
        <div>
          <p className="font-medium">Create Team</p>
          <p className="text-xs text-gray-500">
            Create a project team
          </p>
        </div>
      </button>

      <button
        onClick={handleInviteUser}
        className="flex items-center gap-3 rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
      >
        <UserPlus size={20} />
        <div>
          <p className="font-medium">Invite User</p>
          <p className="text-xs text-gray-500">
            Add a new member
          </p>
        </div>
      </button>

      <button
        onClick={handleManageRoles}
        className="flex items-center gap-3 rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
      >
        <UserCog size={20} />
        <div>
          <p className="font-medium">Manage Roles</p>
          <p className="text-xs text-gray-500">
            Manage permissions
          </p>
        </div>
      </button>
    </div>
  );
};

export default QuickActions;