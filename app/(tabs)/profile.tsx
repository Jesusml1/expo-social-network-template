import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, View, useWindowDimensions } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import useAuthStore from "../../store/useAuthStore";

const ProfilePage = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  async function handleLogout() {
    await authStore.signOutUser(); 
    router.replace("/");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: screenWidth - 40 }}>
        <Card
          onPress={() => Alert.alert("Are you sure?")}
          style={{ height: 100, padding: 10, marginBottom: 40 }}
        >
          <Text style={{ fontWeight: "bold" }}>Email</Text>
          {authStore.user && <Text>{authStore.user.email}</Text>}
        </Card>
        <Button
          mode="contained"
          onPress={() =>
            Alert.alert("Are you sure?", "Are you sure you want to logout?", [
              { text: "cancel", onPress: () => {} },
              { text: "logout", onPress: handleLogout },
            ])
          }
          style={{ marginBottom: 16 }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default ProfilePage;
