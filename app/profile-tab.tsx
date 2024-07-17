import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import firebaseApp from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { getAuth, signOut } from "firebase/auth";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { getStorage } from "@firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { updateUserDataByUserID } from "@/constants/FirebaseFunction";
import { deleteUserWhileLogout } from "@/constants/SQLFuction";
const { buttonGradient } = Colors.light;

export default function ProfileTab() {
  const {
    postAccountCta,
    newPostInsideText,
    newPostInsideContainer,
    newPostText,
    newPostContainer,
    mainContainer,
    postMessageButton,
    gradient,
    imageContainer,
    postButton,
  } = styles;
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [loaderShow, setLoaderShow] = useState<boolean>(false);
  const navigation = useNavigation();

  const auth = getAuth(firebaseApp);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2, // Adjust the quality here (0 to 1)
      base64: true, // Set to true if you want base64 representation
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handlePostMessage = async () => {
    if (loaderShow) {
      return;
    }

    const imageUpload = await uploadImage(selectedPhoto);
    if (imageUpload && imageUpload !== "") {
      await updateUserDataByUserID(global?.userData?.userID, {
        profile: imageUpload,
      });
    }
  };

  const logOutUser = async () => {
    try {
      await signOut(auth);
      await deleteUserWhileLogout();
      navigation.reset({
        index: 0,
        routes: [{ name: "login-screen" }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (imageUri === "") {
      return "";
    }
    setLoaderShow(true);
    const firebaseStorage = getStorage(firebaseApp);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const imageName = `${Date.now()}.png`; // Replace with your desired filename

    const storageRef = ref(firebaseStorage, imageName);

    const uploadTask = uploadBytes(storageRef, blob);

    // Get the download URL after the upload is complete
    return uploadTask
      .then((snapshot) => {
        // Get the download URL
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        // Use the download URL
        setLoaderShow(false);
        console.log("File uploaded successfully. Download URL:", downloadURL);
        return downloadURL;
      })
      .catch((error) => {
        // Handle any errors
        setLoaderShow(false);
        console.error("Error uploading file:", error);
        return "";
      });
  };

  return (
    <View style={mainContainer}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: 50,
        }}
      >
        {selectedPhoto !== "" || global.userData?.profile ? (
          <Image
            source={{
              uri:
                selectedPhoto !== "" ? selectedPhoto : global.userData?.profile,
            }}
            style={imageContainer}
          />
        ) : null}
        <TouchableOpacity
          onPress={pickImage}
          style={{
            backgroundColor: "#4bc7f3",
            padding: 5,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text>{"Upload Profile"}</Text>
        </TouchableOpacity>
      </View>

      <View style={newPostContainer}>
        <Text style={newPostText}>{"User Detail"}</Text>
        <View style={newPostInsideContainer}>
          <Text style={newPostInsideText} numberOfLines={4}>
            Name: {global.userData.name ?? ""}
          </Text>
          <Text style={newPostInsideText}>
            Email: {global.userData.email ?? ""}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 70 }}>
        <TouchableOpacity style={postMessageButton} onPress={handlePostMessage}>
          <LinearGradient
            colors={buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[gradient, postButton]}
          >
            {loaderShow ? (
              <ActivityIndicator />
            ) : (
              <Text style={postAccountCta}>Save</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[postMessageButton, { marginLeft: 10 }]}
          onPress={logOutUser}
        >
          <LinearGradient
            colors={buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[gradient, postButton]}
          >
            <Text style={postAccountCta}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
