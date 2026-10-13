import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/store";

import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

import { refreshAccessToken } from "../../services/Auth/authService";

import { setAccessToken } from "../../store/slice/tokenSlice";
import { setUser } from "../../store/slice/authSlice";

import { getOrganization } from "../../services/Organization/organizationService";

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [error, setError] = useState(false);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // ----------------------------------------
                // 1. Get access token using refresh token
                // ----------------------------------------

                const response = await refreshAccessToken();

                const accessToken = response?.data?.accessToken;
                const user = response?.data?.user;

                if (!accessToken) {
                    throw new Error("Access token not received");
                }

                // ----------------------------------------
                // 2. Store authentication data
                // ----------------------------------------

                dispatch(setAccessToken(accessToken));

                if (user) {
                    dispatch(setUser(user));
                }

                // ----------------------------------------
                // 3. Check organization
                // ----------------------------------------

                try {
                    await getOrganization();

                    // Organization exists
                    navigate(FRONTEND_ROUTES.DASHBOARD, {
                        replace: true,
                    });

                } catch (organizationError: any) {

                    // Organization does not exist
                    if (
                        organizationError?.response?.status === 404
                    ) {
                        navigate(
                            FRONTEND_ROUTES.ORGANIZATION_SETUP,
                            {
                                replace: true,
                            }
                        );

                        return;
                    }

                    throw organizationError;
                }

            } catch (error) {
                console.error(
                    "Google authentication callback failed:",
                    error
                );

                setError(true);
            }
        };

        handleGoogleCallback();
    }, [dispatch, navigate]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">
                        Google login failed
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Something went wrong while signing in with Google.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(FRONTEND_ROUTES.LOGIN, {
                                replace: true,
                            })
                        }
                        className="mt-4 rounded-lg px-4 py-2"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-xl font-semibold">
                    Signing you in...
                </h1>

                <p className="mt-2 text-gray-500">
                    Please wait while we complete your Google login.
                </p>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;