import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import firebaseApp from "@/firebase";

const getUserDataByUserID = async (userID) => {
  try {
    console.log(userID);

    const db = getFirestore(firebaseApp);
    // Reference to the users collection
    const usersCollection = collection(db, "users");

    // Query to find the user with the specific userID
    const q = query(usersCollection, where("userID", "==", userID));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if a document was found
    if (!querySnapshot.empty) {
      // Extract user data from the first document (assuming userID is unique)
      const userData = querySnapshot.docs[0].data();
      console.log("User data:", userData);
      global.userData = userData;
      return userData;
    } else {
      console.log("No user found with the specified userID.");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

const updateUserDataByUserID = async (userID, newUserData) => {
  try {
    console.log(`Updating data for userID: ${userID}`);
    console.log(`Updating data for userID: ${JSON.stringify(newUserData)}`);

    const db = getFirestore(firebaseApp);
    // Reference to the users collection
    const usersCollection = collection(db, "users");

    // Query to find the user with the specific userID
    const q = query(usersCollection, where("userID", "==", userID));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if a document was found
    if (!querySnapshot.empty) {
      // Get the document reference of the first document (assuming userID is unique)
      let userData = querySnapshot.docs[0].data();
      userData = { ...userData, ...newUserData };

      const userDocRef = querySnapshot.docs[0].ref;

      // Update the document with new data
      await updateDoc(userDocRef, userData);
      global.userData = userData;
      console.log("User data updated successfully.");
      return true;
    } else {
      console.log("No user found with the specified userID.");
      return false;
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

const getGraphData = async () => {
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersCollection, orderBy("createdAt", "asc")),
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      createdAt: data.createdAt.toDate(),
    };
  });
};

export {
  getUserDataByUserID,
  updateUserDataByUserID,
  getAllUser,
  getGraphData,
};
