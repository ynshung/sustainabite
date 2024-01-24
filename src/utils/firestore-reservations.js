import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import _ from "underscore";

export const getReservations = (
  reservationListing,
  setReservationListing,
  userID,
  userType,
) => {
  const q = query(
    collection(db, "reservations"),
    where(userType, "==", userID),
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newReservationListing = _.clone(reservationListing) ?? {};
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newReservationListing[change.doc.id] = change.doc.data();
      }
      if (change.type === "modified") {
        newReservationListing[change.doc.id] = change.doc.data();
      }
      if (change.type === "removed") {
        delete newReservationListing[change.doc.id];
      }
    });
    if (!_.isEqual(newReservationListing, reservationListing))
      setReservationListing(newReservationListing);
  });
  return unsubscribe;
};
