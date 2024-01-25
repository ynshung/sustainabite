import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import _ from "underscore";

async function newListing(vendorID, obj, updateUID = null) {
  let newObj = _.clone(obj);

  newObj.price = parseFloat(newObj.price);
  newObj.qty = parseInt(newObj.qty);
  newObj.vendor = vendorID;

  const isUpdateDoc = updateUID ? true : false;

  if (!isUpdateDoc) {
    newObj.createdAt = serverTimestamp();
  }
  newObj.updatedAt = serverTimestamp();

  let docRef = updateUID
    ? doc(db, "listing", updateUID)
    : doc(collection(db, "listing"));

  updateUID = updateUID ? updateUID : docRef.id;

  if (newObj.img && newObj.img[0].size > 1000) {
    newObj.img = newObj.img[0];

    // Check if file is larger than 5MB
    if (newObj.img.size > 5000000) {
      throw new Error("Image size too large! Max 5MB.");
    }

    const storageRef = ref(
      storage,
      `items/${updateUID}/${Date.now()}-${newObj.img.name}`,
    );
    const snapshot = await uploadBytes(storageRef, newObj.img);

    newObj.img = await getDownloadURL(snapshot.ref);
  }

  isUpdateDoc ? await updateDoc(docRef, newObj) : await setDoc(docRef, newObj);

  updateDoc(doc(db, "vendor", vendorID), {
    activeItems: increment(isUpdateDoc || !newObj.active || !newObj.active ? 0 : 1),
  });

  return docRef.id;
}

const deleteListing = async (id) => {
  const docRef = doc(db, "listing", id);
  return await deleteDoc(docRef);
}

export { newListing, deleteListing };
