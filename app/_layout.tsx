import { Stack, useRouter } from "expo-router";
import React from "react";
import { PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const StackLayout = () => {
  const router = useRouter();

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
        <Stack.Screen
          name="register"
          options={{ headerTitle: "Create account" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
};

export default StackLayout;
