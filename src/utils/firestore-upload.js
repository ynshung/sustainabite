import { db, storage } from "../firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadFirestore(obj, uid, accountType, isUpdate = false) {
  if (accountType === "vendors") {
    obj.latitude = parseFloat(obj.latitude);
    obj.longitude = parseFloat(obj.longitude);
    obj.approved = false;
  }

  obj.createdAt = serverTimestamp();

  await setDoc(doc(db, "accountType", uid), {
    accountType: accountType,
  });
  if (isUpdate) {
    await updateDoc(doc(db, accountType, uid), obj);
  } else {
    await setDoc(doc(db, accountType, uid), obj);
  }
}

async function uploadProfileFiles(obj, uid) {
  if (obj.avatar && obj.avatar[0].size > 1000) {
    obj.avatar = obj.avatar[0];

    // Check if file is larger than 2MB
    if (obj.avatar.size > 10000000) {
      throw new Error("Image size too large! Max 10MB.");
    }

    const storageRef = ref(storage, `avatars/${uid}/${obj.avatar.name}`);
    const snapshot = await uploadBytes(storageRef, obj.avatar);
    console.log("Uploaded a blob or file!");

    obj.avatar = await getDownloadURL(snapshot.ref);
  }

  if (obj.proofOfOwnership && obj.proofOfOwnership[0].size > 1000) {
    obj.proofOfOwnership = obj.proofOfOwnership[0];

    // Check if file is larger than 2MB
    if (obj.proofOfOwnership.size > 2000000) {
      throw new Error("Image size too large! Max 2MB.");
    }

    const storageRef = ref(
      storage,
      `proofOfOwnership/${uid}/${obj.proofOfOwnership.name}`,
    );
    const snapshot = await uploadBytes(storageRef, obj.proofOfOwnership);
    console.log("Uploaded a blob or file!");

    obj.proofOfOwnership = await getDownloadURL(snapshot.ref);
  }

  return obj;
}

export { uploadFirestore, uploadProfileFiles };
