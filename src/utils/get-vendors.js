import { collection, query, where, onSnapshot } from "firebase/firestore";
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
