import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const DashboardSidebar = () => {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <aside className="hidden w-64 flex-col border-r bg-white md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Nexora
        </h1>
      </div>

      {/* New Project */}
      <div className="p-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {/* Dashboard */}
        <Link
          to={FRONTEND_ROUTES.DASHBOARD}
          className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-900"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Users - ADMIN ONLY */}
        {isAdmin && (
          <Link
            to={FRONTEND_ROUTES.USER}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            <Users size={18} />
            Users
          </Link>
        )}

        {/* Projects */}
        <Link
          to={FRONTEND_ROUTES.PROJECTS}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <FolderKanban size={18} />
          Projects
        </Link>

        {/* Teams */}
        {/* Teams - ADMIN ONLY */}
{isAdmin && (
  <Link
    to={FRONTEND_ROUTES.TEAMS}
    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
  >
    <UsersRound size={18} />
    Teams
  </Link>
)}

{/* My Team - MEMBERS */}
{!isAdmin && (
  <Link
    to={FRONTEND_ROUTES.MY_TEAM}
    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
  >
    <UsersRound size={18} />
    My Team
  </Link>
)}

        {/* Invitations - ADMIN ONLY */}
        {isAdmin && (
          <Link
            to={FRONTEND_ROUTES.INVITATIONS}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            <UserPlus size={18} />
            Invitations
          </Link>
        )}

        {/* Notifications */}
        <Link
          to={FRONTEND_ROUTES.NOTIFICATIONS}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <Bell size={18} />
          Notifications
        </Link>
      </nav>

      {/* Settings */}
      <div className="border-t p-3">
        <Link
          to={FRONTEND_ROUTES.SETTINGS}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;