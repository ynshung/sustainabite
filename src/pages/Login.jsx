import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
// import { redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthProvider } from "reactfire";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const signIn = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // redirect("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        switch (errorCode) {
          case "auth/invalid-email":
            toast.error("Invalid email address.");
            break;
          case "auth/user-disabled":
            toast.error("Your account has been disabled.");
            break;
          case "auth/user-not-found":
            toast.error("User not found.");
            break;
          case "auth/invalid-login-credentials":
            toast.error("Invalid login credentials.");
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
    <AuthProvider sdk={auth}>
      <ToastContainer />
      <div className="min-h-screen flex flex-col justify-center">
        <div className="flex flex-col w-[24em] content-center rounded-xl text-neutral-900 bg-bone-50 mx-auto shadow-lg">
          <form className="flex flex-col gap-5 px-7 py-8 pb-4">
            <h1 className="text-3xl font-bold">Login</h1>
            <div className="join join-vertical">
              <input
                type="email"
                placeholder="Email"
                className="input join-item w-full max-w-xs bg-inherit border-taupe-600 border-opacity-20 text-neutral-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input join-item w-full max-w-xs bg-inherit border-taupe-600 border-opacity-20 text-neutral-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!loading ? (
              <button
                className="btn btn-secondary w-[8em] text-neutral-50 mx-auto border-0 bg-gradient-to-r from-primary-500 to-primary-250 capitalize text-lg font-nunito"
                onClick={signIn}
              >
                Sign In
              </button>
            ) : (
              <progress className="progress w-56 mx-auto progress-primary" />
            )}
          </form>
          <div className="mx-8 mb-6 text-sm text-center">
            <p className="text-neutral-600">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="link">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default Login;
