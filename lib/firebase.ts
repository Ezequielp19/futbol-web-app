import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  // apiKey: "AIzaSyDA0vwXaHOvPLpGdddIckJGuPC4suT7A-M",
  // authDomain: "demoapp-67a54.firebaseapp.com",
  // databaseURL: "https://demoapp-67a54-default-rtdb.firebaseio.com",
  // projectId: "demoapp-67a54",
  // storageBucket: "demoapp-67a54.firebasestorage.app",
  // messagingSenderId: "310298209164",
  // appId: "1:310298209164:web:97fc0a46e4f568df6684a9"

  apiKey: "AIzaSyCpGByP4yV91k0hm3TZX8P3NHQUuckNumw",
  authDomain: "app-servicios-e99de.firebaseapp.com",
  databaseURL: "https://app-servicios-e99de-default-rtdb.firebaseio.com",
  projectId: "app-servicios-e99de",
  storageBucket: "app-servicios-e99de.appspot.com",
  messagingSenderId: "281743607632",
  appId: "1:281743607632:web:11509479f18726330e0e55",
  measurementId: "G-0CTZQ2JPY2"
}



const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)
export default app
