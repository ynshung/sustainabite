import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaList, FaPencil } from "react-icons/fa6";
import MapList from "../../components/map/MapList";
import { Marker, Popup } from "react-leaflet";

const Dashboard = () => {
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState(null);
  let [accountType, setAccountType] = useState("");
  const navigate = useNavigate();

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
      {user && accountType === "users" ? (
        <>
          <MapList>
            <Marker position={[5.354, 100.301]}>
              <Popup>Test Location</Popup>
            </Marker>
          </MapList>
          <div className="m-8">
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
        </>
      ) : accountType === "vendors" ? (
        <>
          <MapList>
            <Marker position={[5.354669283327304, 100.3015388795525]}>
              <Popup>Your vendor&apos;s location</Popup>
            </Marker>
          </MapList>
          <div className="m-8">
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
        </>
      ) : accountType === "charities" ? (
        <>Charities</>
      ) : (
        <>
          {!loading ? (
            <>
              You shouldn&#39;t be here! Please reload the page or
              relogin/register.
            </>
          ) : (
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
