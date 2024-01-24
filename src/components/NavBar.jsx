import { TbBell, TbMenuDeep } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import sustainabite from "../assets/sustainabite-lb-bg.png";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UseUserContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { authUser, loaded } = useUserContext();

  return (
    <div className="navbar shadow-md bg-theme1-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-ghost btn-circle">
            <TbMenuDeep size={20} />
          </div>
          <ul
            tabIndex="0"
            className="menu dropdown-content mt-3 bg-theme1-100 z-[10000] p-2 shadow-lg rounded-box w-52 "
          >
            {loaded && authUser ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                <li>
                  <a
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You will be logged out!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, log me out!",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          auth.signOut();
                          toast.success("Logged out successfully!");
                          navigate("/login");
                        }
                      });
                    }}
                  >
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to={loaded && authUser ? "/dashboard" : "/"} className="btn btn-ghost text-xl">
          <img src={sustainabite} width={32} height={32}></img>SustainaBite
        </Link>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <TbBell size={24} />
            <span className="badge badge-xs badge-primary indicator-item "></span>
            <span className="badge badge-xs badge-primary indicator-item animate-ping origin-bottom-left"></span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
