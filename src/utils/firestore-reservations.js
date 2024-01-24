import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, increment, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import _ from "underscore";

export const getReservations = (
  reservationListing,
  setReservationListing,
  userID,
  userType,
  showFulfilled = false,
) => {
  let q;
  if (showFulfilled) {
    q = query(
      collection(db, "reservations"),
      where(userType, "==", userID),
      where("userFulfilled", "==", true),
      orderBy("createdAt", "desc"),
    );
  } else {
    q = query(
      collection(db, "reservations"),
      where(userType, "==", userID),
      where("userFulfilled", "==", false),
      orderBy("createdAt", "desc"),
    );
  }
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

export const createReservation = async (
  userID,
  itemID,
  itemQty,
  vendorID,
) => {
  const docRef = await addDoc(collection(db, "reservations"),{
    createdAt: serverTimestamp(),
    listing: itemID,
    qty: parseInt(itemQty),
    user: userID,
    userFulfilled: false,
    vendor: vendorID,
  });

  await updateDoc(doc(db, "users", userID), {
    currentReservation: increment(1),
  });

  await updateDoc(doc(db, "listing", itemID), {
    qty: increment(-parseInt(itemQty)),
  });


  return docRef.id;
};

export const fulfillReservation = async (
  reservationID,
  userID,
  userSaved,
  vendorID,
  vendorEarned,
) => {
  await updateDoc(doc(db, "reservations", reservationID), {
    userFulfilled: true,
  });

  await updateDoc(doc(db, "users", userID), {
    currentReservation: increment(-1),
    totalReservation: increment(1),
    totalSaved: increment(userSaved),
  });

  await updateDoc(doc(db, "vendors", vendorID), {
    totalReservation: increment(1),
    totalEarned: increment(vendorEarned),
  });

  return true;
};

export const reportReservation = async (
  reservationID,
  userID,
  accountType,
  reason,
  comments,
) => {
  await updateDoc(doc(db, "reservations", reservationID), {
    reported: true,
    reportedBy: userID,
    reportedByType: accountType,
    reason: reason,
    comments: comments,
  });

  return true;
};
  
