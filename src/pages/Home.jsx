import { Link } from "react-router-dom";
import { useUserContext } from "../context/UseUserContext";

function Home() {
  let { authUser, loaded } = useUserContext();

  return (
    <div>
      <div>
        <h2 className="m-8 pt-8 flex flex-row gap-7 items-center flex-wrap xs:flex-nowrap">
          <img
            src="https://sustainabite.pages.dev/android-chrome-512x512.png"
            alt="Sustainabite logo"
            className="w-40 xs:w-32 flex-none"
            width={128}
            height={128}
          />
          <span className="text-6xl flex-1">
            <span className="font-title">Bite</span> into{" "}
            <span className="font-title text-theme1-700">Change</span>
          </span>
        </h2>
        <h3 className="mx-8 text-xl">
          Your go-to app where savoury bites are share, making every bite count
          in the battle against food waste.
        </h3>
        <div className="m-8">
          {loaded || authUser ? (
            authUser ? (
              <Link
                to={
                  authUser.email !== "admin@ynshung.com"
                    ? "/dashboard"
                    : "/admin"
                }
                className="btn btn-primary text-white btn-lg text-2xl w-min rounded-xl shadow-lg text-nowrap"
              >
                {authUser.email === "admin@ynshung.com" && "Admin "}Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary text-white btn-lg text-2xl w-min rounded-xl shadow-lg text-nowrap"
              >
                Get Started!
              </Link>
            )
          ) : (
            <div className="skeleton w-36 h-16"></div>
          )}
        </div>
      </div>
      <br />
      <br />
      <div>
        <p className="text-center my-3">
          &#169; 2024 Universiti Sains Malaysia
        </p>
      </div>
    </div>
  );
}

export default Home;
