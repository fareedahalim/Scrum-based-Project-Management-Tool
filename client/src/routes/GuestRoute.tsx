
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";

const GuestRoute = () => {
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken
  );

  if (accessToken) {
    return (
      <Navigate
        to={FRONTEND_ROUTES.DASHBOARD}
        replace
      />
    );
  }

  return <Outlet />;
};

export default GuestRoute;