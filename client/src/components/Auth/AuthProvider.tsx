import { useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";

import { setAccessToken, clearAccessToken } from "../../store/slice/tokenSlice";
import { setUser, clearUser } from "../../store/slice/authSlice";
import { refreshAccessToken } from "../../services/Auth/authService";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreAuthentication = async () => {
      try {
        const response = await refreshAccessToken();

        console.log("Refresh response:", response);

        const { accessToken, user } = response.data;

        dispatch(setAccessToken(accessToken));
        dispatch(setUser(user));
      } catch (error) {
        console.log("No active login session");

        dispatch(clearAccessToken());
        dispatch(clearUser());
      } finally {
        setIsRestoring(false);
      }
    };

    restoreAuthentication();
  }, [dispatch]);

  if (isRestoring) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;