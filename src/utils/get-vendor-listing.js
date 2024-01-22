import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import _ from "underscore";

export const getVendorListing = (
  vendorListing,
  setListing,
  vendorID,
  showAll = false,
) => {
  const q = showAll
    ? query(collection(db, "listing"), where("vendor", "==", vendorID))
    : query(
        collection(db, "listing"),
        where("vendor", "==", vendorID),
        where("active", "==", true),
        where("qty", ">", 0),
        orderBy("qty", "asc"),
        orderBy("createdAt", "asc"),
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

export async function getSpecificListing(listingID) {
  const docRef = doc(db, "listing", listingID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
}
