import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { fallbackComponent } from "./components/FallbackComponent";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NavBar from "./components/NavBar";
import CenterElement from "./components/CenterElement";
import GetStarted from "./pages/GetStarted";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/Dashboard";

export function App() {
  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <BrowserRouter>
        <ToastContainer />
        <div className="min-h-screen flex flex-col bg-white">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route element={<CenterElement />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/admin/dashboard" />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
