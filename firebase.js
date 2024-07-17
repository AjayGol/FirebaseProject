import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDd5-zBMiH38Fu1kdmueFIPD_MBGaKdBjU",
  authDomain: "fir-demo-cc4ee.firebaseapp.com",
  projectId: "fir-demo-cc4ee",
  storageBucket: "fir-demo-cc4ee.appspot.com",
  messagingSenderId: "590133831713",
  appId: "1:590133831713:web:8f8916e5131b66420b9b60",
  measurementId: "G-3F8FDW5HEH",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
