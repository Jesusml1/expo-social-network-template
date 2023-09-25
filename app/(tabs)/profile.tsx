import { View } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { Button } from "react-native-paper";

const ProfilePage = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        mode="contained"
        onPress={() => router.replace("/")}
        style={{ marginBottom: 16 }}
      >
        Logout
      </Button>
    </View>
  );
};

export default ProfilePage;
