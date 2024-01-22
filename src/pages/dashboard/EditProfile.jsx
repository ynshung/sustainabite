import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../../components/profile/UserProfile";
import OrgProfile from "../../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { FaAngleLeft } from "react-icons/fa6";
import {
  uploadFirestore,
  uploadProfileFiles,
} from "../../utils/firestore-upload";
import { useUserContext } from "../../context/UseUserContext";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);

  const { accountType, authUser, user, loaded } = useUserContext();

  useEffect(() => {
    if (loaded && (!user)) {
      navigate("/dashboard");
    }
  }, [navigate, loaded, user]);

  useEffect(() => {
    if (formData && !_.isEmpty(formData) && authUser.email && authUser.uid) {
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
  }, [formData, navigate, accountType, authUser]);

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

        {(loading || !user) && (
          <div className="flex justify-center">
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          </div>
        )}

        {user && accountType === "users" && (
          <UserProfile
            email={authUser.email}
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}

        {user && accountType === "vendors" && (
          <OrgProfile
            email={authUser.email}
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}

        {user && accountType === "charities" && (
          <OrgProfile
            email={authUser.email}
            charity
            onChildData={setFormData}
            defaultObj={user}
            loading={loading}
            setLoading={setLoading}
            editProfile
          />
        )}
      </div>
    </>
  );
};

export default EditProfile;
