import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/store";
import AuthProvider from "./components/Auth/AuthProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          > */}
            <AuthProvider>
              <App />
            </AuthProvider>
          {/* </GoogleOAuthProvider> */}
        </BrowserRouter>

        <Toaster />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);