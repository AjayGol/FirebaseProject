import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import screenNames from "@/components/navigation/ScreenNames";
import { SQLiteProvider } from "expo-sqlite";
import { createDataBase } from "@/constants/SQLFuction";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().then((r) => console.log(r));

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().then((r) => console.log(r));
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="test.db" onInit={createDataBase}>
        <Stack
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
          }}
        >
          <Stack.Screen
            name={screenNames.CreateAccount}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={screenNames.Login}
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name={screenNames.TabBar}
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
