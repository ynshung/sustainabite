import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronLeft, FaCircleInfo, FaList, FaPencil } from "react-icons/fa6";
import MapList from "../../components/map/MapList";
import VendorItemsList from "../../components/list/VendorItemsList";
import VendorList from "../../components/list/VendorList";
import { getVendors } from "../../utils/get-vendors";
import { useUserContext } from "../../context/UseUserContext";

const Dashboard = () => {
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  let [selectedVendorID, setSelectedVendorID] = useState(null);

  let { authUser, user, accountType, error, loaded } = useUserContext();

  useEffect(() => {
    if (loaded) {
      if (!authUser) {
        navigate("/login");
      } else if (!accountType || !user) {
        console.log(accountType)
        console.log(user)
        navigate("/get-started");
      }
      setLoading(false);
    } else if (error) {
      toast.error(error);
      navigate("/login");
    }
  }, [authUser, accountType, user, loaded, navigate, error]);

  const [vendors, setVendors] = useState({});

  useEffect(() => {
    const unsubscribe = getVendors(vendors, setVendors);

    return () => {
      unsubscribe();
    };
  }, [vendors]);

  return (
    <>
      {!loading && (
        <div className="mx-8 mt-8">
          <div className="flex flex-row gap-4 items-center">
            {accountType !== "users" && (
              <div className="avatar w-16">
                <img src={user.avatar} className="mx-auto" />
              </div>
            )}
            <div>
              <p className="text-3xl font-bold">
                Hello, {user && user.firstName}!
              </p>
              {user.orgName && <p>Organization Name: {user.orgName}</p>}
            </div>
          </div>
          <br />
        </div>
      )}
      {loading ? (
        <progress className="progress w-56 mx-auto progress-primary my-24" />
      ) : user && (accountType === "users" || accountType === "charities") ? (
        <>
          <MapList
            viewListing={(id) => {
              setSelectedVendorID(id);
            }}
            selectedVendorID={selectedVendorID}
            vendors={vendors}
          />
          {selectedVendorID ? (
            <div className="m-8">
              <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => setSelectedVendorID(null)}
              >
                <FaChevronLeft className="inline" size={18} /> Go back to Vendor
                List
              </div>
              <hr className="my-4" />
              <h2 className="font-bold text-3xl">
                {vendors[selectedVendorID].orgName}
              </h2>
              <p className="mt-1 mb-4">
                Total listing: {vendors[selectedVendorID].activeItems}
              </p>
              <VendorItemsList
                vendor={selectedVendorID}
                userType={accountType}
              />
            </div>
          ) : (
            <div className="mx-8 my-6">
              <h2 className="text-xl font-bold mb-2">Vendors Near You</h2>
              <VendorList
                vendors={vendors}
                viewListing={(id) => {
                  setSelectedVendorID(id);
                }}
              />
            </div>
          )}
          <div className="mx-8">
            <ul className="menu menu-lg bg-base-200 rounded-box">
              <li>
                <Link
                  to="edit-profile"
                  className="flex items-center gap-3"
                >
                  <FaPencil />
                  Edit Your Profile
                </Link>
              </li>
              <li>
                <Link to="404" className="flex items-center gap-3">
                  <FaList />
                  Do Something
                </Link>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <br/>
        </>
      ) : accountType === "vendors" ? (
        <>
          {user && user.approved === true ? (
            <div className="mx-8">
              <ul className="menu menu-lg bg-base-200 rounded-box">
                <li>
                  <Link
                    to="listing"
                    className="flex items-center gap-3"
                  >
                    <FaList />
                    View Current Listing
                  </Link>
                </li>
                <li>
                  <Link
                    to="edit-profile"
                    className="flex items-center gap-3"
                  >
                    <FaPencil />
                    Edit Your Profile
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mx-8">
              <div role="alert" className="alert">
                <FaCircleInfo size={24} />
                <span>
                  Your account is pending approval.
                  <br />
                  We will update with you via phone and email once your
                  application is processed.
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          You shouldn&#39;t be here! Please reload the page or relogin/register.
        </>
      )}
    </>
  );
};

export default Dashboard;
