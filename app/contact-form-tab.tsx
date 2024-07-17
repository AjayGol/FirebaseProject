import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import { Colors } from "@/constants/Colors";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
import { LinearGradient } from "expo-linear-gradient";

export default function ContactFormTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loaderShow, setLoaderShow] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email);
    }
  }, []);

  const handleFormSubmit = async () => {
    try {
      if (name.trim() === "") {
        Alert.alert("Validation Error", "Please enter your name");
        return;
      }
      if (mobileNumber.trim() === "" || !/^\d+$/.test(mobileNumber)) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid phone number (digits only)",
        );
        return;
      }
      setLoaderShow(true);
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, "contact-form"), {
        createdAt: new Date(),
        name: name,
        email: email,
        number: mobileNumber,
      });
      setLoaderShow(false);
      setName("");
      setMobileNumber("");
    } catch (error) {
      setLoaderShow(false);
      console.error("Error adding contactForm: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
        <LinearGradient
          colors={Colors.light.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, styles.postButton]}
        >
          {loaderShow ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.textInputBorder,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    borderColor: Colors.light.buttonBorder,
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 30,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 19,
    fontWeight: "700",
    alignItems: "center",
    justifyContent: "center",
  },
  postAccountCta: {
    color: Colors.light.background,
    fontSize: 19,
    fontWeight: "700",
    alignItems: "center",
    justifyContent: "center",
  },
  postButton: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    borderRadius: 6,
    overflow: "hidden",
  },
});
