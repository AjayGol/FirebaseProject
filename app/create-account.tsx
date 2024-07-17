import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../firebase";
import { styles } from "./styles";
import { emailValidation } from "@/constants/String";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getUserDataByUserID } from "@/constants/FirebaseFunction";
const { buttonGradient } = Colors.light;

export default function CreateAccount() {
  const navigation = useNavigation();
  const {
    createPostContainer,
    commonTextInput,
    createAccountContainer,
    createAccountText,
    createAccountCta,
    createAccountButton,
    textInputCreate,
    loginButton,
    gradient,
  } = styles;
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onPressCreateAccount = async () => {
    try {
      if (userName === "") {
        Alert.alert("Please enter userName");
        return;
      }
      if (emailValidation(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address");
        return;
      }
      if (password === "") {
        Alert.alert("Please enter password");
        return;
      }
      if (password === "" || password !== confirmPassword) {
        Alert.alert("Passwords don't match");
        return;
      }

      setLoading(true);
      const auth = getAuth(firebaseApp);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userID = userCredential.user.uid;

      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, "users"), {
        createdAt: new Date(),
        email: email,
        name: userName,
        userID: userID,
        profilePic: "",
      });
      await getUserDataByUserID(userID);
      setLoading(false);

      Alert.alert("Creat account successfully");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert("User already exits");
      console.log(error);
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View style={createPostContainer}>
      <View style={createAccountContainer}>
        <Text style={createAccountText}>{"Create an account"}</Text>
      </View>
      <View style={styles.textInputMainView}>
        <TextInput
          style={[commonTextInput, textInputCreate]}
          placeholder="Name"
          placeholderTextColor="gray"
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={[commonTextInput, textInputCreate]}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={commonTextInput}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry
        />
        <TextInput
          style={commonTextInput}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={createAccountButton}
        onPress={onPressCreateAccount}
      >
        <LinearGradient
          colors={buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={gradient}
        >
          {(loading && <ActivityIndicator />) || (
            <Text style={createAccountCta}>{"Create Account"}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressBack}>
        <Text style={[createAccountCta, loginButton]}>{"Login"}</Text>
      </TouchableOpacity>
    </View>
  );
}
