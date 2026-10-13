
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";
import { useGetOrganization } from "../hooks/Organization/OrganizationHooks";

const PublicRoute = () => {
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken
  );

  const organizationQuery = useGetOrganization({
    enabled: Boolean(accessToken),
  });

  if (!accessToken) {
    return <Outlet />;
  }

  if (organizationQuery.isLoading) {
    return <p className="p-6">Checking organization setup...</p>;
  }

  if (organizationQuery.isError) {
    const status = (organizationQuery.error as any)?.response?.status;

    if (status === 404) {
      return (
        <Navigate
          to={FRONTEND_ROUTES.ORGANIZATION_SETUP}
          replace
        />
      );
    }

    return (
      <div className="p-6">
        <p>Unable to check organization setup.</p>
        <button
          type="button"
          onClick={() => organizationQuery.refetch()}
          className="mt-3 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <Navigate
      to={FRONTEND_ROUTES.DASHBOARD}
      replace
    />
  );
};

export default PublicRoute;

