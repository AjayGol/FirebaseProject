import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import screenNames from "@/components/navigation/ScreenNames";
import firebaseApp from "@/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getUserDataByUserID } from "@/constants/FirebaseFunction";
import { useSQLiteContext } from "expo-sqlite";
import { getUser } from "@/constants/SQLFuction";

export default function Page() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const result = await getUser(db);

        if (!result.length) {
          navigation.reset({
            index: 0,
            routes: [{ name: screenNames.Login }],
          });
        } else {
          const auth = getAuth(firebaseApp);
          try {
            if (result.length > 0) {
              const userData = result[0];
              const userCredential = await signInWithEmailAndPassword(
                auth,
                userData.email,
                userData.password,
              );
              const userID = userCredential.user.uid;
              await getUserDataByUserID(userID);

              navigation.reset({
                index: 0,
                routes: [{ name: screenNames.TabBar }],
              });
            }
          } catch (error) {
            console.error("Error handling stored token:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch the token from storage", error);
      }
    };

    checkLoginState().then((r) =>
      console.log("check user already login or not"),
    );
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
