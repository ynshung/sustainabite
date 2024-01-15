import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../components/profile/UserProfile";
import OrgProfile from "../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");

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
  }, [navigate, user]);

  useEffect(() => {
    if (formData && !_.isEmpty(formData) && user.uid) {
      let obj = {
        ...formData,
        email: user.email,
        accountType: accountType,
      };
      console.log(obj);

      // If obj contains proofOfOwnership File, upload to Firebase Storage and replace with downloadURL
      if (obj.proofOfOwnership) {
        obj.proofOfOwnership = obj.proofOfOwnership[0];
        const storageRef = ref(
          storage,
          `proofOfOwnership/${user.uid}/${obj.proofOfOwnership.name}`,
        );
        uploadBytes(storageRef, obj.proofOfOwnership)
          .then((snapshot) => {
            console.log("Uploaded a blob or file!");
            getDownloadURL(snapshot.ref).then((url) => {
              console.log(url);
              obj.proofOfOwnership = url;

              let docName;

              let firebaseObj = JSON.parse(JSON.stringify(obj));
              delete firebaseObj.proofOfOwnership;

              setDoc(doc(db, accountType, user.uid), firebaseObj)
                .then(() => {
                  setDoc(doc(db, "accountTypes", user.uid), {
                    accountType: accountType,
                  })
                    .then(() => {
                      navigate("/dashboard");
                    })
                    .catch((error) => {
                      toast.error(error.message);
                      console.error(
                        "Error writing document " + accountType + ": ",
                        error,
                      );
                    });
                })
                .catch((error) => {
                  toast.error(error.message);
                  console.error(
                    "Error writing document " + docName + ": ",
                    error,
                  );
                });
            });
          })
          .catch((error) => {
            toast.error(error.message);
            console.log(error);
          });
      } else {
        let firebaseObj = JSON.parse(JSON.stringify(obj));
        delete firebaseObj.proofOfOwnership;

        setDoc(doc(db, accountType, user.uid), firebaseObj)
          .then(() => {
            setDoc(doc(db, "accountType", user.uid), {
              accountType: accountType,
            })
              .then(() => {
                toast.success("Account created successfully!");
                navigate("/dashboard");
              })
              .catch((error) => {
                toast.error(error.message);
                console.error("Error writing document accountType: ", error);
              });
          })
          .catch((error) => {
            toast.error(error.message);
            console.error(
              "Error writing document " + accountType + ": ",
              error,
            );
          });
      }
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
              <label className="label cursor-pointer justify-start gap-4">
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
              </label>
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
            <h1 className="font-bold text-xl">Individual Registration</h1>
            <p className="text-neutral-600">
              Complete your profile info below.
            </p>
            <UserProfile email={user.email} onChildData={setFormData} />
          </>
        ) : accountType === "vendors" ? (
          <>
            <h1 className="font-bold text-xl">Vendor Registration</h1>
            <p className="text-neutral-600">
              Complete your profile info below.
            </p>
            <OrgProfile email={user.email} onChildData={setFormData} />
          </>
        ) : accountType === "charities" ? (
          <>
            <h1 className="font-bold text-xl">Organization Registration</h1>
            <p className="text-neutral-600">
              Complete your profile info below.
            </p>
            <OrgProfile email={user.email} charity onChildData={setFormData} />
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
