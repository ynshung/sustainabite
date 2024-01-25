import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import _ from "underscore";
import { Outlet } from "react-router-dom";

export const AdminContext = createContext();

export function AdminProvider() {
  const [reports, setReports] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subVerification = async () => {
      const q = query(
        collection(db, "vendors"),
        where("approved", "==", false),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newVerification = _.clone(verification ?? {});
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newVerification[change.doc.id] = change.doc.data();
          }
          if (change.type === "modified") {
            newVerification[change.doc.id] = change.doc.data();
          }
          if (change.type === "removed") {
            delete newVerification[change.doc.id];
          }
        });
        if (!_.isEqual(newVerification, verification))
          setVerification(newVerification);
      });
      return unsubscribe;
    };

    const subReports = async () => {
      const q = query(
        collection(db, "reservations"),
        where("reported", "==", true),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newReports = _.clone(reports ?? {});
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newReports[change.doc.id] = change.doc.data();
          }
          if (change.type === "modified") {
            newReports[change.doc.id] = change.doc.data();
          }
          if (change.type === "removed") {
            delete newReports[change.doc.id];
          }
        });
        if (!_.isEqual(newReports, reports)) setReports(newReports);
      });
      return unsubscribe;
    };

    let s1;
    let s2;
    let s3;
    if (!loaded) {
      s3 = onAuthStateChanged(auth, (u) => {
        if (u && u.email === "admin@ynshung.com") {
          subVerification();
          subReports();
          setLoaded(true);
          console.log("Admin loaded!");
        } else {
          setError("Not authorized.");
        }
      });
    }

    return () => {
      if (s1) s1();
      if (s2) s2();
      if (s3) s3();
    };
  }, [verification, reports, loaded]);

  return (
    <AdminContext.Provider
      value={{ verification, reports, error, setError, loaded }}
    >
      <Outlet />
    </AdminContext.Provider>
  );
}

AdminProvider.propTypes = {
  children: PropTypes.node,
};
