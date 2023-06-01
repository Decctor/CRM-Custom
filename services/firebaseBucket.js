import admin from "firebase-admin";
import { firebaseServiceAccount } from "../utils/constants";

export default async function getBucket() {
  var sdkApp = admin.apps.find((app) => app.name == "SDK");
  if (!sdkApp) {
    sdkApp = admin.initializeApp(
      {
        credential: admin.credential.cert(firebaseServiceAccount),
        storageBucket: "sistemaampere.appspot.com",
      },
      "SDK"
    );
  }

  const bucket = sdkApp.storage().bucket();
  return bucket;
}
