import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowUpRightFromSquare,
  FaBook,
  FaBookBookmark,
  FaChevronLeft,
  FaCircleInfo,
  FaClockRotateLeft,
  FaHandHoldingDollar,
  FaList,
  FaPencil,
  FaPlus,
} from "react-icons/fa6";
import MapList from "../../components/map/MapList";
import VendorItemsList from "../../components/list/VendorItemsList";
import VendorList from "../../components/list/VendorList";
import { getVendors } from "../../utils/firestore-vendors";
import { useUserContext } from "../../context/UseUserContext";
import ReservationList from "../../components/list/ReservationList";
import { normalizePhoneNumber } from "../../utils/normalize-phone-no";
import Swal from "sweetalert2";

const Dashboard = () => {
  let [loading, setLoading] = useState(true);

  let [selectedVendorID, setSelectedVendorID] = useState(null);

  let { authUser, user, accountType, error, loaded } = useUserContext();

  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (loaded) {
      if (!authUser) {
        navigate("/login");
      } else if (!accountType || !user) {
        console.log(accountType);
        console.log(user);
        navigate("/get-started");
      }
      setLoading(false);
    } else if (error) {
      if (authUser.email === "admin@ynshung.com") {
        navigate("/admin");
        return;
      }
      toast.error(error);
      if (
        error === "Account type not found! Redirecting to Get Started page..."
      )
        navigate("/get-started");
      else navigate("/login");
    }
  }, [authUser, user, accountType, error, loaded, navigate, pathname, state]);

  const [vendors, setVendors] = useState({});

  useEffect(() => {
    const unsubscribe = getVendors(vendors, setVendors);

    return () => {
      unsubscribe();
    };
  }, [vendors]);

  const tryScrollVendorList = () => {
    setTimeout(() => {
      let scrollInterval = setInterval(() => {
        const element = document.getElementById("vendor-item-list");
        if (element) {
          element.scrollIntoView();
          clearInterval(scrollInterval);
        }
      }, 100);
    }, 100);
  };

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
          {user.currentReservation && user.currentReservation > 0 && (
            <>
              <hr className="pb-4" />
              <div className="mx-8">
                <div className="flex items-center gap-3">
                  <FaBook size={18} />{" "}
                  <h2 className="font-bold text-xl">Current Reservations</h2>
                </div>
                <ReservationList
                  userUID={authUser.uid}
                  userType={accountType}
                />
                <br />
              </div>
            </>
          )}

          <div id="map" />
          <MapList
            viewListing={(id) => {
              setSelectedVendorID(id);
              tryScrollVendorList();
            }}
            selectedVendorID={selectedVendorID}
            vendors={vendors}
          />
          {selectedVendorID ? (
            <div className="mx-8 mt-8">
              <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => setSelectedVendorID(null)}
              >
                <FaChevronLeft className="inline" size={18} /> Go back to Vendor
                List
              </div>
              <hr className="my-4" id="vendor-item-list" />
              <h2 className="font-bold text-3xl">
                {vendors[selectedVendorID].orgName}
              </h2>
              <div className="flex flex-col xs:flex-row justify-between xs:items-end mb-4 mt-2 xs:mt-1 gap-1">
                <div>
                  <p>
                    Phone No.:{" "}
                    <a
                      href={`tel:${normalizePhoneNumber(
                        vendors[selectedVendorID].phoneNumber,
                      )}`}
                      className="hover:underline"
                    >
                      {vendors[selectedVendorID].phoneNumber}
                    </a>
                  </p>
                  <p>Total listing: {vendors[selectedVendorID].activeItems}</p>
                </div>
                <div className="text-right">
                  <div
                    onClick={() => {
                      Swal.fire({
                        title: "Full Address",
                        text: vendors[selectedVendorID].address,
                        icon: "info",
                        confirmButtonText: "Close",
                      });
                    }}
                    className="hover:underline cursor-pointer text-sm"
                  >
                    View Full Address
                  </div>
                  <a
                    href={`http://maps.google.com/maps?q=${vendors[selectedVendorID].latitude},${vendors[selectedVendorID].longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm flex flex-row items-center gap-2 hover:underline"
                  >
                    View on Google Maps
                    <FaArrowUpRightFromSquare size={12} />
                  </a>
                </div>
              </div>
              <VendorItemsList
                vendor={selectedVendorID}
                userType={accountType}
                userUID={authUser.uid}
              />
            </div>
          ) : (
            <div className="mx-8 my-6">
              <h2 className="text-xl font-bold mb-2">Vendors Near You</h2>
              <VendorList
                vendors={vendors}
                viewListing={(id) => {
                  setSelectedVendorID(id);
                  tryScrollVendorList();
                }}
              />
            </div>
          )}
          <hr className="mx-4" />

          <div className="mx-auto my-6">
            <div className="stats stats-vertical xs:stats-horizontal shadow bg-theme1-100">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaBookBookmark size={24} />
                </div>
                <div className="stat-title">Reservation</div>
                <div className="stat-value text-3xl">
                  {user.totalReservation ?? 0}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaHandHoldingDollar size={28} />
                </div>
                <div className="stat-title">Money Saved</div>
                <div className="stat-value text-3xl">
                  RM{user.totalSaved ? user.totalSaved.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-8">
            <ul className="menu menu-lg bg-base-200 rounded-box">
              <li>
                <Link to="history" className="flex items-center gap-3">
                  <FaClockRotateLeft />
                  Reservation History
                </Link>
              </li>
              <li>
                <Link to="edit-profile" className="flex items-center gap-3">
                  <FaPencil />
                  Edit Your Profile
                </Link>
              </li>
            </ul>
          </div>
          <br />
        </>
      ) : accountType === "vendors" ? (
        <>
          {user && user.approved === true ? (
            <div className="mx-8">
              <hr className="mb-4" />
              <div className="mx-4">
                <div className="flex items-center gap-3">
                  <FaBook size={18} />{" "}
                  <h2 className="font-bold text-xl">Current Reservations</h2>
                </div>
                <ReservationList
                  userUID={authUser.uid}
                  userType={accountType}
                />
              </div>
              <hr className="mt-6" />
              <div className="flex justify-center my-6">
                <div className="stats stats-vertical xs:stats-horizontal shadow bg-theme1-100">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FaBookBookmark size={24} />
                    </div>
                    <div className="stat-title">Reservation</div>
                    <div className="stat-value text-3xl">
                      {user.totalReservation ?? 0}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FaHandHoldingDollar size={28} />
                    </div>
                    <div className="stat-title">Money Earned</div>
                    <div className="stat-value text-3xl">
                      RM{user.totalEarned.toFixed(2) ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              <ul className="menu menu-lg bg-base-200 rounded-box">
                <li>
                  <Link to="listing" className="flex items-center gap-3">
                    <FaList />
                    View Current Listing
                  </Link>
                </li>
                <li>
                  <Link to="listing/new" className="flex items-center gap-3">
                    <FaPlus />
                    Create New Listing
                  </Link>
                </li>
                <li>
                  <Link to="history" className="flex items-center gap-3">
                    <FaClockRotateLeft />
                    Reservation History
                  </Link>
                </li>
                <li>
                  <Link to="edit-profile" className="flex items-center gap-3">
                    <FaPencil />
                    Edit Your Profile
                  </Link>
                </li>
              </ul>
              <br />
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
