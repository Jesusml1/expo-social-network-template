import { formatDate } from "utils/formatting";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import usePostStore from "store/usePostStore";
import { RefreshControl } from "react-native-gesture-handler";

const Post = () => {
  const { id } = useLocalSearchParams();
  const { post, setPost, fetchSinglePost } = usePostStore();
  const { width: screenWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPost(Number(id));
    setLoading(false);
  }, []);

  function onRefresh() {
    fetchSinglePost(Number(id));
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      contentContainerStyle={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {!loading && post && (
        <Card style={{ width: screenWidth - 20, padding: 20, margin: 20 }}>
          <Text style={{ marginBottom: 7 }} variant="headlineSmall">
            {post.title}
          </Text>
          <Text style={{ marginBottom: 20, opacity: 0.5 }}>
            by {post.user.name} - {formatDate(post.created_at)}
          </Text>
          <Text>{post.body}</Text>
        </Card>
      )}
    </ScrollView>
  );
};

export default Post;
