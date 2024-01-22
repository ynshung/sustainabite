import { Link, useNavigate } from "react-router-dom";
import VendorItemsList from "../../components/list/VendorItemsList";
import { FaChevronLeft, FaPlus } from "react-icons/fa6";
import { useEffect } from "react";
import { useUserContext } from "../../context/UseUserContext";

const VendorListing = () => {
  const navigate = useNavigate();

  const { accountType, authUser, loaded } = useUserContext();

  useEffect(() => {
    if (loaded && !accountType) {
      navigate("/dashboard");
    }
  }, [navigate, loaded, accountType]);

  return (
    <div className="m-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <Link
          to="/dashboard"
          className="flex flex-row items-center gap-2 cursor-pointer"
        >
          <FaChevronLeft className="inline" size={18} /> Go back to Dashboard
        </Link>

        <Link
          to="new"
          className="btn btn-primary btn-circle btn-sm text-white shadow-lg"
          title="New Listing"
        >
          <FaPlus size={16} />
        </Link>
      </div>
      <h2 className="text-2xl font-bold my-4">Current Listing</h2>
      {loaded ? (
        <VendorItemsList
          vendor={authUser.uid}
          selectItem={(id) => {
            navigate(`${id}`);
          }}
          userType={accountType}
        />
      ) : (
        <div className="flex justify-center my-16">
          <progress className="progress w-56 mx-auto progress-primary" />
        </div>
      )}
      <div className="flex">
        <Link to="new" className="btn btn-primary text-white mx-auto shadow">
          <FaPlus /> New Listing
        </Link>
      </div>
    </div>
  );
};

export default VendorListing;
