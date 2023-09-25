import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { Button } from "react-native-paper";

const LoginPage = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        mode="contained"
        onPress={() => router.replace("/(tabs)/home")}
        style={{ marginBottom: 16 }}
      >
        Login
      </Button>
      <Link href="/register" asChild>
        <Pressable>
          <Text> Open register </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default LoginPage;
