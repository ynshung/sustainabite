import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../components/profile/UserProfile";
import OrgProfile from "../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { FaAngleLeft } from "react-icons/fa6";
import { uploadProfileFiles, uploadFirestore } from "../utils/firestore-upload";
import "../no-scroll-wheel.css";

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState("");

  const navigate = useNavigate();

  let [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        navigate("/login");
      }
    });

    unsubscribe();
  }, [setUser, navigate]);

  useEffect(() => {
    if (formData && !_.isEmpty(formData) && user.uid) {
      let obj = {
        ...formData,
        email: user.email,
        accountType: accountType,
      };

      uploadProfileFiles(obj, user.uid)
        .then((res) => {
          uploadFirestore(res, user.uid, accountType)
            .then(() => {
              setLoading(false);
              navigate("/dashboard");
              window.location.reload();
            })
            .catch((err) => {
              toast.error(err.message);
            });
        })
        .catch((err) => {
          toast.error(err.message);
        });

      // If obj contains proofOfOwnership File, upload to Firebase Storage and replace with downloadURL
    }
  }, [formData, user, navigate, accountType]);

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  const incrementStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
    console.log(currentStep);
  };

  return (
    <div className="m-6">
      {currentStep === 1 ? (
        <>
          <h1 className="font-bold text-xl">Get Started</h1>
          <p className="text-neutral-600">
            Choose your account type to get started.
          </p>
          <form className="form-control" onSubmit={(e) => incrementStep(e)}>
            <div className="my-3">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  name="accountType"
                  type="radio"
                  value="users"
                  className="radio radio-primary"
                  checked={accountType === "users"}
                  onChange={handleAccountTypeChange}
                  required
                />
                <span className="label-text text-lg">Individual</span>
              </label>
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  name="accountType"
                  type="radio"
                  value="vendors"
                  className="radio radio-primary"
                  checked={accountType === "vendors"}
                  onChange={handleAccountTypeChange}
                />
                <span className="label-text text-lg">Vendor*</span>
              </label>
              {/* <label className="label cursor-pointer justify-start gap-4">
                <input
                  name="accountType"
                  type="radio"
                  value="charities"
                  className="radio radio-primary"
                  checked={accountType === "charities"}
                  onChange={handleAccountTypeChange}
                />
                <span className="label-text text-lg">
                  Charity Organization*
                </span>
              </label> */}
              <p>
                <span className="text-sm italic opacity-75">
                  * verification needed
                </span>
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary text-neutral-50 mx-auto text-lg px-8"
            >
              Next
            </button>
          </form>
        </>
      ) : currentStep === 2 ? (
        accountType === "users" ? (
          <>
            <div className="flex flex-row gap-3 items-center">
              <Link to="/get-started" reloadDocument>
                <FaAngleLeft size={24} />
              </Link>
              <div>
                <h1 className="font-bold text-xl">Individual Registration</h1>
                <p className="text-neutral-600">
                  Complete your profile info below.
                </p>
              </div>
            </div>
            <UserProfile
              email={user.email}
              onChildData={setFormData}
              loading={loading}
              setLoading={setLoading}
            />
          </>
        ) : accountType === "vendors" ? (
          <>
            <div className="flex flex-row gap-3 items-center">
              <Link to="/get-started" reloadDocument>
                <FaAngleLeft size={24} />
              </Link>
              <div>
                <h1 className="font-bold text-xl">Vendor Registration</h1>
                <p className="text-neutral-600">
                  Complete your profile info below.
                </p>
              </div>
            </div>
            <OrgProfile
              email={user.email}
              onChildData={setFormData}
              loading={loading}
              setLoading={setLoading}
            />
          </>
        ) : accountType === "charities" ? (
          <>
            <div className="flex flex-row gap-3 items-center">
              <Link to="/get-started" reloadDocument>
                <FaAngleLeft size={24} />
              </Link>
              <div>
                <h1 className="font-bold text-xl">Organization Registration</h1>
                <p className="text-neutral-600">
                  Complete your profile info below.
                </p>
              </div>
            </div>
            <OrgProfile
              email={user.email}
              charity
              onChildData={setFormData}
              loading={loading}
              setLoading={setLoading}
            />
          </>
        ) : (
          <>You shouldn&#39;t be here! Reload the page and try again.</>
        )
      ) : (
        <>You shouldn&#39;t be here! Reload the page and try again.</>
      )}
    </div>
  );
};

export default GetStarted;
