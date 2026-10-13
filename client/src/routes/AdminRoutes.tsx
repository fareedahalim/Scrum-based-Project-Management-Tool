import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";

const AdminRoute = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  if (!user) {
    return (
      <Navigate
        to={FRONTEND_ROUTES.LOGIN}
        replace
      />
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <Navigate
        to={FRONTEND_ROUTES.DASHBOARD}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;