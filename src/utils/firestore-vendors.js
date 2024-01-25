import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import _ from "underscore";

export const getVendors = (vendors, setVendors) => {
  const q = query(collection(db, "vendors"), where("approved", "==", true));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newVendors = _.clone(vendors);
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newVendors[change.doc.id] = change.doc.data();
      }
      if (change.type === "modified") {
        newVendors[change.doc.id] = change.doc.data();
      }
      if (change.type === "removed") {
        delete newVendors[change.doc.id];
      }
    });
    if (!_.isEqual(newVendors, vendors)) setVendors(newVendors);
  });
  return unsubscribe;
};

export async function getSpecificVendor(vendorID) {
  const docRef = doc(db, "vendors", vendorID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
}

export async function rejectVendor(id, reason) {
  const docRef = doc(db, "vendors", id);
  
  await updateDoc(docRef, {
    approved: false,
    rejectionReason: reason,
  });
}

export async function resubmitVerification(id) {
  const docRef = doc(db, "vendors", id);
  
  await updateDoc(docRef, {
    approved: false,
    rejectionReason: deleteField(),
  });
}
