import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { fallbackComponent } from "./components/FallbackComponent";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NavBar from "./components/NavBar";
import CenterElement from "./components/CenterElement";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/dashboard/Dashboard";
import EditProfile from "./pages/dashboard/EditProfile";
import VendorListing from "./pages/dashboard/VendorListing";
import NewListing from "./pages/dashboard/NewListing";
import EditListing from "./pages/dashboard/EditListing";
import ReservationHistory from "./pages/dashboard/ReservationHistory";
import CenterElementMD from "./components/CenterElementMD";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserReports from "./pages/admin/UserReports";
import VerifyOrgs from "./pages/admin/VerifyOrgs";
import { AdminProvider } from "./context/AdminContext";

export function App() {
  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <BrowserRouter>
        <ToastContainer />
        <UserProvider>
          <div className="min-h-screen flex flex-col bg-white shadow">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<CenterElementMD />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route element={<CenterElement />}>
                <Route path="/get-started" element={<GetStarted />} />
              </Route>

              <Route path="/dashboard">
                <Route index element={<Dashboard />} />
                <Route element={<CenterElement />}>
                  <Route path="edit-profile" element={<EditProfile />} />
                </Route>
                <Route path="history" element={<ReservationHistory />} />
                <Route path="listing">
                  <Route index element={<VendorListing />} />
                  <Route element={<CenterElement />}>
                    <Route path="new" element={<NewListing />} />
                    <Route path=":id" element={<EditListing />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/admin" element={<AdminProvider />}>
                <Route index element={<AdminDashboard />} />
                <Route path="verify/:id" element={<VerifyOrgs />} />
                <Route path="reports/:id" element={<UserReports />} />
              </Route>
            </Routes>
          </div>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
