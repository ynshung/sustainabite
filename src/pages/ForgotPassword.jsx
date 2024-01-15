import { useState } from "react";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const resetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/invalid-email":
            toast.error("Invalid email address!");
            break;
          case "auth/user-not-found":
            toast.error("User not found!");
            break;
          default:
            toast.error(errorMessage);
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer />
      <form
        className="flex flex-col gap-5 px-7 py-8 pb-4"
        onSubmit={resetPassword}
      >
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <div className="join join-vertical">
          <input
            type="email"
            placeholder="Email"
            className="input join-item w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!loading ? (
          <button className="btn btn-primary text-neutral-50 mx-auto capitalize text-lg">
            Reset Password
          </button>
        ) : (
          <progress className="progress w-56 mx-auto progress-primary" />
        )}
      </form>
      <div className="mx-8 mb-6 text-sm text-center">
        <p className="text-neutral-600">
          Remember your password?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </p>
        <p className="text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}

export default ForgotPassword;
