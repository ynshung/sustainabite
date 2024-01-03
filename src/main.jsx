import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyAbsrhVlwxbUXIE9cCR3T_NRjjGBKwD3BU",
  authDomain: "sustainabite-usm1.firebaseapp.com",
  projectId: "sustainabite-usm1",
  storageBucket: "sustainabite-usm1.appspot.com",
  messagingSenderId: "735167693032",
  appId: "1:735167693032:web:7ba5b6c97403c671e7095d",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
);
