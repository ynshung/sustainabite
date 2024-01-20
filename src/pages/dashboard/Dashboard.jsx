import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaCircleInfo, FaList, FaPencil } from "react-icons/fa6";
import MapList from "../../components/map/MapList";
import VendorListing from "../../components/list/VendorListing";

const Dashboard = () => {
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState(null);
  let [accountType, setAccountType] = useState("");
  const navigate = useNavigate();

  let [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        getDoc(doc(db, "accountType", u.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              setAccountType(docSnap.data().accountType);

              getDoc(doc(db, accountType, u.uid))
                .then((docSnap) => {
                  if (docSnap.exists()) {
                    setUser(docSnap.data());
                    setLoading(false);
                  } else {
                    toast.error(accountType + " not found!");
                    navigate("/get-started");
                  }
                })
                .catch((error) => {
                  console.log("Error getting document:", error);
                });
            } else {
              navigate("/get-started");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        navigate("/login");
      }
    });

    unsubscribe();
  }, [navigate, accountType]);

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
      ) : user && accountType === "users" ? (
        <>
          <MapList
            viewListing={(id) => {
              setSelectedVendor(id);
            }}
          />
          <VendorListing vendor={selectedVendor} />
          <div className="m-8">
            <ul className="menu menu-lg bg-base-200 rounded-box">
              <li>
                <Link to="edit-profile" className="flex items-center gap-3">
                  <FaPencil />
                  Edit Your Profile
                </Link>
              </li>
              <li>
                <Link to="404" className="flex items-center gap-3">
                  <FaList />
                  See Listings
                </Link>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
        </>
      ) : accountType === "vendors" ? (
        <>
          {user && user.approved === true ? (
            <div className="mx-8">
              <ul className="menu menu-lg bg-base-200 rounded-box">
                <li>
                  <Link to="edit-profile" className="flex items-center gap-3">
                    <FaPencil />
                    Edit Your Profile
                  </Link>
                </li>
                <li>
                  <Link to="listings" className="flex items-center gap-3">
                    <FaList />
                    See Listings
                  </Link>
                </li>
                <li>
                  <a>Item 3</a>
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
      ) : accountType === "charities" ? (
        <>Charities</>
      ) : (
        <>
          You shouldn&#39;t be here! Please reload the page or relogin/register.
        </>
      )}
    </>
  );
};

export default Dashboard;
