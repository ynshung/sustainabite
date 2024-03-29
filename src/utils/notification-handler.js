import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Unable to get permission to notify.");
    }
  });

  getToken(messaging)
}
