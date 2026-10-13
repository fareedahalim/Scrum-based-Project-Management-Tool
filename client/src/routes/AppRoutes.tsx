
import { Routes, Route } from "react-router-dom";

import { FRONTEND_ROUTES } from "../constants/frontendRoutes";

import { LandingPage } from "../pages/Landing/LandingPage";
import SignupPage from "../pages/Auth/SignupPage";
import LoginPage from "../pages/Auth/LoginPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import { ForgotPassword } from "../pages/Auth/ForgotPasswordPage";
import GoogleCallbackPage from "../pages/Auth/GoogleCallbackPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import OrganizationSetupPage from "../pages/Onboarding/OrganizationSetupPage";
import UsersPage from "../pages/User/UserPage";

import InvitationsPage from "../pages/Invitations/InvitationsPage";
import AcceptInvitationPage from "../pages/Invitations/AcceptInvitationPage";

import TeamsPage from "../pages/Team/TeamsPage";
import TeamDetailsPage from "../pages/Team/TeamDetailsPage";
import MyTeamPage from "../pages/Team/MyTeamPage";

import DashboardLayout from "../components/Dashboard/DashboardLayout";

import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoutes";
import OrganizationRequiredRoute from "./OrganizationRequiredRoute";
import GuestRoute from "./GuestRoute";
// import GuestRoute from "./GuestRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route
          path={FRONTEND_ROUTES.LANDING}
          element={<LandingPage />}
        />

        <Route
          path={FRONTEND_ROUTES.SIGNUP}
          element={<SignupPage />}
        />



        <Route
          path={FRONTEND_ROUTES.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        />

        <Route
          path={FRONTEND_ROUTES.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />
      </Route>

      <Route element={<GuestRoute/>}>
        <Route
          path={FRONTEND_ROUTES.LOGIN}
          element={<LoginPage />}
        />
      </Route>

      {/* GOOGLE AUTHENTICATION */}
      <Route
        path={FRONTEND_ROUTES.GOOGLE_CALLBACK}
        element={<GoogleCallbackPage />}
      />

      {/* ACCEPT INVITATION */}
      <Route
        path={FRONTEND_ROUTES.ACCEPT_INVITATION}
        element={<AcceptInvitationPage />}
      />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        {/* Organization setup must be accessible before an organization exists */}
        <Route
          path={FRONTEND_ROUTES.ORGANIZATION_SETUP}
          element={<OrganizationSetupPage />}
        />

        {/* These routes require an existing organization */}
        <Route element={<OrganizationRequiredRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path={FRONTEND_ROUTES.DASHBOARD}
              element={<DashboardPage />}
            />

            <Route
              path={FRONTEND_ROUTES.USER}
              element={<UsersPage />}
            />

            <Route
              path={FRONTEND_ROUTES.TEAMS}
              element={<TeamsPage />}
            />

            <Route
              path={FRONTEND_ROUTES.TEAM_DETAILED_PAGE}
              element={<TeamDetailsPage />}
            />

            <Route
              path={FRONTEND_ROUTES.MY_TEAM}
              element={<MyTeamPage />}
            />

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route
                path={FRONTEND_ROUTES.INVITATIONS}
                element={<InvitationsPage />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

