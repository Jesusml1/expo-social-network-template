import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const Post = () => {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <Text>post {id}</Text>
    </View>
  );
};

export default Post;
