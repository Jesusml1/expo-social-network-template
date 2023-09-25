import React from "react";
import { Stack, useRouter } from "expo-router";
import { Button, PaperProvider } from "react-native-paper";

const StackLayout = () => {
  const router = useRouter();
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerTitle: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerTitle: "Create account",
            headerRight: () => (
              <Button onPress={() => router.push("/modal")}>Open</Button>
            ),
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerLeft: () => (
              <Button onPress={() => router.push("/register")}>Close</Button>
            ),
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
};

export default StackLayout;
