import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileTab from "@/app/profile-tab";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import UserSignupTab from "@/app/user-signup-list";
import ContactFormTab from "@/app/contact-form-tab";
import DashBoardTab from "@/app/dashboard-tab";

export default function TabBar() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            // You can return any component that you like here!
            return <Ionicons name={"home"} size={size} color={color} />;
          } else if (route.name === "Dashboard") {
            return (
              <MaterialIcons name={"dashboard"} size={size} color={color} />
            );
          } else if (route.name === "Contact Form") {
            return <AntDesign name={"profile"} size={size} color={color} />;
          } else if (route.name === "Profile") {
            return <AntDesign name={"contacts"} size={size} color={color} />;
          } else if (route.name === "User SignUp") {
            return <Entypo name={"users"} size={size} color={color} />;
          }
          return null;
        },
        tabBarShowLabel: true, // This will hide the labels
      })}
    >
      <Tab.Screen name="Home" component={Tab1Screen} />
      <Tab.Screen name="Dashboard" component={DashBoardTab} />
      <Tab.Screen name="Contact Form" component={ContactFormTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
      <Tab.Screen name="User SignUp" component={UserSignupTab} />
    </Tab.Navigator>
  );
}

function Tab1Screen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{`Welcome ${global.userData?.name}`}</Text>
    </View>
  );
}
