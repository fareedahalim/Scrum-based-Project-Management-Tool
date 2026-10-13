import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearAccessToken } from "../../store/slice/tokenSlice";
import { clearUser } from "../../store/slice/authSlice";
import { useLogout } from "../../hooks/Auth/AuthHooks";

interface DashboardHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
    role: string;
  } | null;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useLogout();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearAccessToken());
        dispatch(clearUser());

        navigate("/login", { replace: true });
      },

      onError: () => {
        dispatch(clearAccessToken());
        dispatch(clearUser());

        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Right */}
      <div className="ml-6 flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>

        {/* Settings */}
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Settings size={20} />
        </button>

        {/* User */}
        <div className="relative border-l pl-4">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={fullName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-medium">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900">
                {fullName}
              </p>

              <p className="text-xs capitalize text-gray-500">
                {user?.role}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-white p-2 shadow-lg">
              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={18} />
                Profile
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <LogOut size={18} />
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;