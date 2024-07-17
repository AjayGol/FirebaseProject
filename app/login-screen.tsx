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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import screenNames from "@/components/navigation/ScreenNames";
import { emailValidation } from "@/constants/String";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import firebaseApp from "@/firebase";
import { styles } from "@/app/styles";
import { getUserDataByUserID } from "@/constants/FirebaseFunction";
import { storeUserData } from "@/constants/SQLFuction";
const { buttonGradient } = Colors.light;

export default function LoginScreen() {
  const navigation = useNavigation();
  const {
    loginContainer,
    commonTextInput,
    signUpContainer,
    signUpText,
    dividerContainer,
    line,
    textInputMainView,
    text,
    loginButtonContainer,
    gradient,
  } = styles;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (emailValidation(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    } else if (password.length === 0) {
      Alert.alert("Invalid Password", "Please enter a valid password");
      return;
    }
    try {
      setLoading(true);
      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userID = userCredential.user.uid;
      await getUserDataByUserID(userID);
      // const accessToken = await userCredential.user.getIdToken();
      await storeUserData(email, password);
      setLoading(false);

      navigation.reset({
        index: 0,
        routes: [{ name: screenNames.TabBar }],
      } as never);
    } catch (error) {
      setLoading(false);
      Alert.alert("Invalid Credential");
      console.log(error);
    }
  };

  const handleSignUp = () => {
    navigation.navigate(screenNames.CreateAccount as never);
  };

  const Divider = () => {
    return (
      <View style={dividerContainer}>
        <View style={line} />
        <Text style={text}>or</Text>
        <View style={line} />
      </View>
    );
  };

  return (
    <View style={loginContainer}>
      <TouchableOpacity style={signUpContainer} onPress={handleSignUp}>
        <LinearGradient
          colors={buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={gradient}
        >
          <Text style={signUpText}>Sign up</Text>
        </LinearGradient>
      </TouchableOpacity>
      {Divider()}
      <View style={textInputMainView}>
        <TextInput
          style={commonTextInput}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInput
          style={commonTextInput}
          placeholder="Password"
          value={password}
          placeholderTextColor="gray"
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={loginButtonContainer} onPress={handleLogin}>
        <LinearGradient
          colors={buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={gradient}
        >
          {(loading && <ActivityIndicator />) || (
            <Text style={signUpText}>Log In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
