import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Dashboard = () => {
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState(null);
  let [accountType, setAccountType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        console.log(u.uid);
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
              toast.error("accountType not found!");
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
      {user && accountType === "users" ? (
        <>Users</>
      ) : accountType === "vendors" ? (
        <>v</>
      ) : accountType === "charities" ? (
        <>c</>
      ) : (
        <>
          {!loading ? (
            <>You shouldn&#39;t be here! Please reload the page or relogin/register.</>
          ) : (
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
