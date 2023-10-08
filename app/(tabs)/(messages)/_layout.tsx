import { Stack } from "expo-router";
import React from "react";

export default () => {
  return (
    <Stack initialRouteName="messages">
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "chat" }} />
    </Stack>
  );
};

