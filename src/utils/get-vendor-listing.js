import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const getVendorListing = (setListing, vendorID, unsubscribe) => {
  const q = query(
    collection(db, "listing"),
    where("vendor", "==", vendorID),
    where("active", "==", true),
  );
  unsubscribe = onSnapshot(q, (querySnapshot) => {
    const listing = {};
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        listing[change.doc.id] = change.doc.data();
      }
      if (change.type === "modified") {
        listing[change.doc.id] = change.doc.data();
      }
      if (change.type === "removed") {
        delete listing[change.doc.id];
      }
    });
    setListing(listing);
  });
  return unsubscribe;
};
