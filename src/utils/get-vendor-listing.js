import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import _ from "underscore";

export const getVendorListing = (vendorListing, setListing, vendorID) => {
  const q = query(
    collection(db, "listing"),
    where("vendor", "==", vendorID),
    where("active", "==", true),
    where("qty", ">", 0),
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newVendorListing = _.clone(vendorListing);
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newVendorListing[change.doc.id] = change.doc.data();
      }
      if (change.type === "modified") {
        newVendorListing[change.doc.id] = change.doc.data();
      }
      if (change.type === "removed") {
        delete newVendorListing[change.doc.id];
      }
    });
    if (!_.isEqual(newVendorListing, vendorListing))
      setListing(newVendorListing);
  });
  return unsubscribe;
};
