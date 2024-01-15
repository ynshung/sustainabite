import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  console.log(window.location.origin);
  let actionCodeSettings = {
    url: window.location.origin + "/login",
  };

  const signUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        // send confirmation email
        sendEmailVerification(user, actionCodeSettings)
          .then(() => {
            toast.success(
              "Email verification sent! Check your inbox or spam folder.",
            );
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorCode + ": " + errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/invalid-email":
            toast.error("Invalid email address!");
            break;
          case "auth/weak-password":
            toast.error("Password is too weak!");
            break;
          case "auth/email-already-in-use":
            toast.error("Email already in use!");
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
      <form className="flex flex-col gap-5 px-7 py-8 pb-4" onSubmit={signUp}>
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="input w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="join join-vertical">
          <input
            type="password"
            placeholder="Password"
            className="input join-item w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input join-item w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {!loading ? (
          <button className="btn btn-primary w-[8em] text-neutral-50 mx-auto capitalize text-lg">
            Sign Up
          </button>
        ) : (
          <progress className="progress w-56 mx-auto progress-primary" />
        )}
      </form>
      <div className="mx-8 mb-6 text-sm text-center">
        <p className="text-neutral-600">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log In
          </Link>
        </p>
      </div>
    </>
  );
}

export default SignUp;
