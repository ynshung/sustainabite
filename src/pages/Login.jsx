import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        toast.success("Logged in successfully!");
        navigate("/dashboard", { state: { reload: true } });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/invalid-email":
            toast.error("Invalid email address!");
            break;
          case "auth/user-disabled":
            toast.error("Your account has been disabled!");
            break;
          case "auth/user-not-found":
            toast.error("Account does not exist!");
            break;
          case "auth/invalid-login-credentials":
            toast.error("Invalid login credentials!");
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
      <form className="flex flex-col gap-5 px-7 py-8 pb-4" onSubmit={signIn}>
        <h1 className="text-3xl font-bold">Login</h1>
        <div className="join join-vertical">
          <input
            type="email"
            placeholder="Email"
            className="input join-item w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input join-item w-full max-w-xs border-theme3-600 border-opacity-20 text-neutral-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!loading ? (
          <button className="btn btn-primary w-[8em] text-neutral-50 mx-auto text-lg font-nunito">
            Sign In
          </button>
        ) : (
          <progress className="progress w-56 mx-auto progress-primary" />
        )}
      </form>
      <div className="mx-8 mb-6 text-sm text-center">
        <p className="text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="link">
            Sign Up
          </Link>
        </p>
        <p className="text-neutral-600">
          <Link to="/forgot-password" className="link">
            Forgot Password?
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
