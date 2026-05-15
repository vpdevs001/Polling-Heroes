import { Outlet } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.js";
import { PageContainer } from "./components/layout/PageContainer.js";
import { ProtectedRoute } from "./components/layout/ProtectedRoute.js";
import { LoginPage } from "./pages/auth/LoginPage.js";
import { RegisterPage } from "./pages/auth/RegisterPage.js";
import { CreatePollPage } from "./pages/dashboard/CreatePollPage.js";
import { DashboardPage } from "./pages/dashboard/DashboardPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { PollAnalyticsPage } from "./pages/poll/PollAnalyticsPage.js";
import { PollRespondPage } from "./pages/poll/PollRespondPage.js";
import { PollResultsPage } from "./pages/poll/PollResultsPage.js";
import { HomePage } from "./pages/HomePage.js";
import { VerifyEmailPage } from "./pages/VerifyEmailPage.js";

function PublicShell() {
  return (
    <>
      <Navbar />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <PublicShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "create", element: <CreatePollPage /> },
          { path: "polls/:pollId/analytics", element: <PollAnalyticsPage /> },
        ],
      },
    ],
  },
  {
    path: "/poll",
    element: <PublicShell />,
    children: [
      { path: ":slug", element: <PollRespondPage /> },
      { path: ":slug/results", element: <PollResultsPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
