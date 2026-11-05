
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  CheckCheck,
  Circle,
  X,
  Inbox,
  Sparkles,
  ChevronDown,
  Clock3,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { Notification } from "../../types/notificationTypes";

import { clearAccessToken } from "../../store/slice/tokenSlice";
import { clearUser } from "../../store/slice/authSlice";

import { useLogout } from "../../hooks/Auth/AuthHooks";

import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../../hooks/Notification/NotificationHooks";

import { useGetStoryById } from "../../hooks/Story/StoryHook";

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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [notificationFilter, setNotificationFilter] = useState<
    "ALL" | "UNREAD"
  >("ALL");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: notificationData,
    isLoading: isNotificationsLoading,
  } = useGetNotifications();

  const {
    data: selectedStory,
    isSuccess: isStoryFetched,
    isError: isStoryFetchError,
  } = useGetStoryById(selectedStoryId, Boolean(selectedStoryId));

  const { mutate: logout, isPending } = useLogout();

  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const {
    mutate: markAllAsRead,
    isPending: isMarkingAllAsRead,
  } = useMarkAllNotificationsAsRead();

  const unreadCount = notificationData?.unreadCount ?? 0;

  const filteredNotifications =
    notificationData?.notifications.filter((notification) =>
      notificationFilter === "UNREAD" ? !notification.isRead : true
    ) ?? [];

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "";

  useEffect(() => {
    if (isStoryFetched && selectedStory) {
      navigate(
        `/projects/${selectedStory.projectId}/stories?storyId=${selectedStory._id}`
      );

      setSelectedStoryId("");
    }

    if (isStoryFetchError) {
      setSelectedStoryId("");
    }
  }, [
    isStoryFetched,
    isStoryFetchError,
    selectedStory,
    navigate,
  ]);

  const handleNotificationItemClick = (
    notification: Notification
  ) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    setIsNotificationOpen(false);

    if (
      notification.eventType === "STORY_READY" &&
      notification.resourceId
    ) {
      setSelectedStoryId(notification.resourceId);
    }
  };

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

  const formatNotificationDate = (date: string) => {
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    const now = new Date();
    const diff = now.getTime() - notificationDate.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return notificationDate.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-40 flex h-[76px] w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

      {/* Search */}
      <div className="relative w-full max-w-[420px]">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-16 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-400 shadow-sm">
          Ctrl K
        </span>
      </div>

      {/* Right Actions */}
      <div className="ml-3 flex items-center gap-2 sm:gap-4">

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              isNotificationOpen
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <Bell size={20} strokeWidth={1.8} />

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-3 w-[min(400px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_45px_-12px_rgba(15,23,42,0.22)]">

              {/* Notification Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Stay updated with your project activity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setNotificationFilter("ALL")}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      notificationFilter === "ALL"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotificationFilter("UNREAD")}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      notificationFilter === "UNREAD"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Unread
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAllAsRead}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:opacity-50"
                  >
                    <CheckCheck size={14} />
                    {isMarkingAllAsRead ? "Updating..." : "Mark all read"}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[390px] overflow-y-auto">

                {isNotificationsLoading ? (
                  <div className="flex flex-col items-center justify-center px-5 py-12">
                    <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
                    <p className="mt-3 text-xs text-slate-400">
                      Loading notifications...
                    </p>
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`group relative border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                        !notification.isRead ? "bg-indigo-50/40" : "bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationItemClick(notification)
                        }
                        className="flex w-full gap-3 px-5 py-4 text-left"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          notification.isRead
                            ? "bg-slate-100 text-slate-500"
                            : "bg-indigo-100 text-indigo-600"
                        }`}>
                          <Sparkles size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-[13px] leading-5 ${
                              notification.isRead
                                ? "font-medium text-slate-700"
                                : "font-semibold text-slate-900"
                            }`}>
                              {notification.message}
                            </p>

                            {!notification.isRead && (
                              <Circle
                                size={8}
                                fill="currentColor"
                                className="mt-1.5 shrink-0 text-indigo-500"
                              />
                            )}
                          </div>

                          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock3 size={12} />
                            {formatNotificationDate(notification.createdAt)}
                          </p>
                        </div>
                      </button>

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification._id)}
                          className="absolute bottom-3 right-5 text-[10px] font-semibold text-indigo-600 opacity-0 transition hover:text-indigo-800 group-hover:opacity-100 focus:opacity-100"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Inbox size={25} strokeWidth={1.5} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      {notificationFilter === "UNREAD"
                        ? "You're all caught up!"
                        : "No notifications yet"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {notificationFilter === "UNREAD"
                        ? "You have no unread notifications."
                        : "Your project updates will appear here."}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-center">
                <p className="text-[11px] text-slate-400">
                  You're viewing your latest notifications
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Settings"
        >
          <Settings size={19} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-slate-200 sm:block" />

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50 sm:gap-3"
            aria-expanded={isProfileOpen}
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={fullName}
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-[13px] font-semibold text-slate-800">
                {fullName}
              </p>

              <p className="mt-0.5 text-[11px] capitalize text-slate-400">
                {user?.role?.toLowerCase()}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-slate-400 transition-transform sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_45px_-12px_rgba(15,23,42,0.22)]">

              {/* Profile Details */}
              <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-4">
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={fullName}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {fullName}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <User size={17} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <div className="my-2 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
