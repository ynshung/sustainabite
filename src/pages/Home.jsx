import { Link } from "react-router-dom";

function Home() {
    return (
      <>
        <Link to="/login" className="link">
          Login
        </Link>
        <Link to="/sign-up" className="link">
          Sign up
        </Link>
        <Link to="/get-started" className="link">
          Get Started
        </Link>
        <Link to="/dashboard" className="link">
          Dashboard
        </Link>
      </>
    );
}

export default Home;
