import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (!loaded) {
      unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          setAuthUser(u);

          getDoc(doc(db, "accountType", u.uid))
            .then((docSnap) => {
              if (docSnap.exists()) {
                setAccountType(docSnap.data().accountType);

                getDoc(doc(db, accountType, u.uid))
                  .then((docSnap) => {
                    if (docSnap.exists()) {
                      setUser(docSnap.data());
                      setLoaded(true);
                      console.log("User loaded!");
                    } else {
                      setError(accountType + " not found!");
                    }
                  })
                  .catch((error) => {
                    console.log(
                      `Error getting document ${accountType}:`,
                      error,
                    );
                    setError(error.message);
                  });
              } else {
                setError("Account type not found! Redirecting to Get Started page...");
              }
            })
            .catch((error) => {
              console.log("Error getting document accountType:", error);
              // setError(error.message);
            });
        } else {
          setError("Not logged in!");
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [accountType, authUser, user, loaded]);

  return (
    <UserContext.Provider
      value={{ user, authUser, accountType, error, setError, loaded }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node,
};
