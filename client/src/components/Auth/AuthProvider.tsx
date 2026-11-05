import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAccessToken, clearAccessToken } from "../../store/slice/tokenSlice";
import { setUser, clearUser } from "../../store/slice/authSlice";
import { refreshAccessToken } from "../../services/Auth/authService";
import type { RootState } from "../../store/store";
import { connectSocket, disconnectSocket } from "../../services/socket/socketService";
import NotificationSocketListener from "../../components/Notification/NotificationSocketListener";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken
  );
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
      setIsSocketReady(true);
    } else {
      disconnectSocket();
      setIsSocketReady(false);
    }

    return () => {
      disconnectSocket();
      setIsSocketReady(false);
    };
  }, [accessToken]);


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

  return (
    <>
      {isSocketReady && <NotificationSocketListener />}
      {children}
    </>
  );
};

export default AuthProvider;