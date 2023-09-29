import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View, useWindowDimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const { clearErrors, getUser, user } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      clearErrors();
      getUser();
      if (user) {
        router.push("/(tabs)/(posts)/home");
      }
    }, [user])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        variant="headlineLarge"
        style={{ color: "black", marginBottom: 40 }}
      >
        Welcome
      </Text>
      <View style={{ width: screenWidth - 40 }}>
        <Button
          mode="contained"
          onPress={() => router.push("/login")}
          style={{ marginBottom: 20, borderRadius: 5 }}
        >
          Sign In
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push("/register")}
          style={{ marginBottom: 20, borderRadius: 5 }}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default LoginPage;
