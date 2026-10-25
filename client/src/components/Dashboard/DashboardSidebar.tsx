
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
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const DashboardSidebar = () => {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  const location = useLocation();

  const isAdmin = currentUser?.role === "ADMIN";

  const isActive = (path: string) => {
    if (path === FRONTEND_ROUTES.DASHBOARD) {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive(path)
      ? "bg-gray-100 font-medium text-gray-900"
      : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-white md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Nexora
        </h1>
      </div>

      {/* New Project — Admin only */}
      {isAdmin && (
        <div className="p-4">
          <Link
            to={FRONTEND_ROUTES.PROJECTS}
            state={{ openCreateProjectModal: true }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Project          
            </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <Link
          to={FRONTEND_ROUTES.DASHBOARD}
          className={linkClass(FRONTEND_ROUTES.DASHBOARD)}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Admin only */}
        {isAdmin && (
          <>
            <Link
              to={FRONTEND_ROUTES.USER}
              className={linkClass(FRONTEND_ROUTES.USER)}
            >
              <Users size={18} />
              Users
            </Link>

            <Link
              to={FRONTEND_ROUTES.TEAMS}
              className={linkClass(FRONTEND_ROUTES.TEAMS)}
            >
              <UsersRound size={18} />
              Teams
            </Link>

            <Link
              to={FRONTEND_ROUTES.INVITATIONS}
              className={linkClass(FRONTEND_ROUTES.INVITATIONS)}
            >
              <UserPlus size={18} />
              Invitations
            </Link>
          </>
        )}

        {/* Projects — all authenticated roles */}
        <Link
          to={FRONTEND_ROUTES.PROJECTS}
          className={linkClass(FRONTEND_ROUTES.PROJECTS)}
        >
          <FolderKanban size={18} />
          Projects
        </Link>

        {/* Members */}
        {!isAdmin && currentUser?.role === "MEMBER" && (
          <Link
            to={FRONTEND_ROUTES.MY_TEAM}
            className={linkClass(FRONTEND_ROUTES.MY_TEAM)}
          >
            <UsersRound size={18} />
            My Team
          </Link>
        )}

        <Link
          to={FRONTEND_ROUTES.NOTIFICATIONS}
          className={linkClass(FRONTEND_ROUTES.NOTIFICATIONS)}
        >
          <Bell size={18} />
          Notifications
        </Link>
      </nav>

      {/* Settings */}
      <div className="border-t p-3">
        <Link
          to={FRONTEND_ROUTES.SETTINGS}
          className={linkClass(FRONTEND_ROUTES.SETTINGS)}
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
