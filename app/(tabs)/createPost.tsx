import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { TextInput } from "react-native-paper";

const CreatePostPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    async function getUser() {
      const storedUser = await SecureStore.getItemAsync("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log(storedUser);
      }
    }
    getUser();
  }, []);

  async function handleLogout() {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
      <View style={{ width: screenWidth - 40, marginTop: 40 }}>
        <TextInput
          placeholder="Title"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <TextInput
          placeholder="Body"
          mode="outlined"
          numberOfLines={10}
          multiline
          style={{ marginBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default CreatePostPage;
