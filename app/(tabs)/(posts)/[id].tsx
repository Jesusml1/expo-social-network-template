import { formatDate } from "utils/formatting";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import usePostStore from "store/usePostStore";

const Post = () => {
  const { id } = useLocalSearchParams();
  const { post, setPost } = usePostStore();
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    setPost(Number(id));
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      {post && (
        <Card style={{ width: screenWidth - 20, padding: 20, margin: 20 }}>
          <Text style={{ marginBottom: 10 }} variant="headlineSmall">
            {post.title}
          </Text>
          <Text style={{ marginBottom: 20 }}>{formatDate(post.created_at)}</Text>
          <Text>{post.body}</Text>
        </Card>
      )}
    </View>
  );
};

export default Post;
