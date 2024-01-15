import { TbBell, TbMenuDeep } from "react-icons/tb";
import { Link } from "react-router-dom";
import sustainabite from "../assets/sustainabite-lb-bg.png";

const NavBar = () => {
  return (
    <div className="navbar shadow-md bg-theme1-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-ghost btn-circle">
            <TbMenuDeep size={20} />
          </div>
          <ul
            tabIndex="0"
            className="menu dropdown-content mt-3 bg-theme1-100 z-[1] p-2 shadow-lg rounded-box w-52 "
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl">
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
