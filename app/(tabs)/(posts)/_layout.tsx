import { Stack } from "expo-router";
import React from "react";

export default () => {
  return (
    <Stack initialRouteName="home">
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Post" }} />
    </Stack>
  );
};
