
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import OrganizationSetupForm from "../../components/Onbording/OrganizationSetupForm";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { useGetOrganization } from "../../hooks/Organization/OrganizationHooks";

const OrganizationSetupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const organizationQuery = useGetOrganization();

  useEffect(() => {
    if (
      location.pathname !== FRONTEND_ROUTES.ORGANIZATION_SETUP ||
      organizationQuery.isSuccess
    ) {
      return;
    }

    // Add a history entry so Back does not immediately leave setup.
    window.history.pushState(
      { organizationSetup: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      if (
        window.location.pathname !==
        FRONTEND_ROUTES.ORGANIZATION_SETUP
      ) {
        navigate(FRONTEND_ROUTES.ORGANIZATION_SETUP, {
          replace: true,
        });
        return;
      }

      // Keep another setup entry in browser history.
      window.history.pushState(
        { organizationSetup: true },
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    location.pathname,
    navigate,
    organizationQuery.isSuccess,
  ]);

  if (organizationQuery.isSuccess) {
    return (
      <Navigate
        to={FRONTEND_ROUTES.DASHBOARD}
        replace
      />
    );
  }

  if (
    organizationQuery.isLoading ||
    (organizationQuery.isFetching && !organizationQuery.isError)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Checking organization setup...
        </p>
      </div>
    );
  }

  if (
    organizationQuery.isError &&
    (organizationQuery.error as { response?: { status?: number } })
      ?.response?.status !== 404
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-red-500">
          Unable to check organization setup.
        </p>
        <button
          type="button"
          onClick={() => organizationQuery.refetch()}
          className="text-blue-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Set Up Your Organization
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Tell us a little about your organization to get started with Nexora.
          </p>
        </div>

        <OrganizationSetupForm />
      </div>
    </div>
  );
};

export default OrganizationSetupPage;