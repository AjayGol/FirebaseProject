import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { getAllUser } from "@/constants/FirebaseFunction";

export default function UserSignupTab() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await getAllUser();
      setUsers(userList);
    };

    fetchUsers().then((r) => console.log("call fetch user"));
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
      {item.profile ? (
        <Image
          source={{
            uri: item.profile,
          }}
          style={styles.imageContainer}
        />
      ) : null}
      <View>
        <Text style={styles.emailText}>Name: {item.name}</Text>
        <Text style={styles.emailText}>Email: {item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  userContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.light.buttonBorder,
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    marginHorizontal: 20,
  },
  emailText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  imageContainer: { height: 50, width: 50, marginRight: 10, borderRadius: 10 },
});
