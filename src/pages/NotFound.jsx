import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
      <div className="text-center max-w-md p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-theme3-500 text-center">404</h1>
        <p className="py-4 text-gray-700">Oops! Page not found.</p>
        <div className="flex flex-col gap-2">
            <button
              className="btn btn-primary text-white"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <Link to="/" className="btn btn-primary text-white">
              Go to Main Page
            </Link>
        </div>
      </div>
  );
};

export default NotFound;
