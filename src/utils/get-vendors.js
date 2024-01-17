import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const getVendors = (setVendors, unsubscribe) => {
  const q = query(collection(db, "vendors"), where("activeItems", ">", 0));
  unsubscribe = onSnapshot(q, (querySnapshot) => {
    const vendors = {};
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        vendors[change.doc.id] = change.doc.data();
      }
      if (change.type === "modified") {
        vendors[change.doc.id] = change.doc.data();
      }
      if (change.type === "removed") {
        delete vendors[change.doc.id];
      }
    });
    setVendors(vendors);
  });
  return unsubscribe;
};
