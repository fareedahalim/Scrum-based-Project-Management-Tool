
import { Navigate, Outlet } from "react-router-dom";

import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import { useGetOrganization } from "../hooks/Organization/OrganizationHooks";

const OrganizationRequiredRoute = () => {
  const organizationQuery = useGetOrganization();

  // Wait until the organization check finishes.
  if (
    organizationQuery.isLoading ||
    (organizationQuery.isFetching && !organizationQuery.data)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Checking organization setup...
        </p>
      </div>
    );
  }

  if (organizationQuery.isError) {
    const status = (
      organizationQuery.error as {
        response?: { status?: number };
      }
    )?.response?.status;

    if (status === 404) {
      return (
        <Navigate
          to={FRONTEND_ROUTES.ORGANIZATION_SETUP}
          replace
        />
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-red-500">
          Unable to load organization details.
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

  return <Outlet />;
};

export default OrganizationRequiredRoute;