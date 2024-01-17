import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../../components/profile/UserProfile";
import OrgProfile from "../../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { FaAngleLeft } from "react-icons/fa6";
import {
  uploadFirestore,
  uploadProfileFiles,
} from "../../utils/firebase-upload";

const EditProfile = () => {
  const [accountType, setAccountType] = useState("");

  const [formData, setFormData] = useState("");

  const navigate = useNavigate();

  let [authUser, setAuthUser] = useState(null);
  let [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
    });

    unsubscribe();
  }, []);

  useEffect(() => {
    if (authUser && authUser.uid) {
      getDoc(doc(db, "accountType", authUser.uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            setAccountType(docSnap.data().accountType);

            getDoc(doc(db, accountType, authUser.uid))
              .then((docSnap) => {
                if (docSnap.exists()) {
                  setUser(docSnap.data());
                } else {
                  toast.error(accountType + " not found!");
                  console.log("accountType not found!");
                  navigate("/get-started");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
                toast.error(error.message);
              });
          } else {
            navigate("/get-started");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [navigate, accountType, authUser]);

  useEffect(() => {
    if (formData && !_.isEmpty(formData) && authUser && authUser.uid) {
      let obj = {
        ...formData,
        email: authUser.email,
        accountType: accountType,
      };

      uploadProfileFiles(obj, authUser.uid)
        .then((res) => {
          uploadFirestore(res, authUser.uid, accountType)
            .then(() => {
              toast.success("Profile updated!");
              setLoading(false);
            })
            .catch((err) => {
              toast.error(err.message);
              console.log("Error while updating data: " + err.message);
            });
        })
        .catch((err) => {
          toast.error(err.message);
          console.log("Error while uploading file: " + err.message);
        });
    }
  }, [formData, authUser, navigate, accountType]);

  return (
    <>
      <div className="m-6">
        <div className="flex flex-row gap-3 items-center">
          <Link to="/dashboard">
            <FaAngleLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-xl">Edit Profile</h1>
            <p className="text-neutral-600">Change your profile info below.</p>
          </div>
        </div>

        {accountType === "users" && user && (
          <UserProfile
            email={user.email}
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}

        {accountType === "vendors" && user && (
          <OrgProfile
            email={user.email}
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}

        {accountType === "charities" && user && (
          <OrgProfile
            email={user.email}
            charity
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}

        {accountType === "" && (
          <div className="flex justify-center">
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
