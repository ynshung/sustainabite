import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getSpecificUser(userID) {
  const docRef = doc(db, "users", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
}
