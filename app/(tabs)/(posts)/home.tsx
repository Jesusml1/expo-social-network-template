import { Link, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Pressable,
  useWindowDimensions
} from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import usePostStore from "store/usePostStore";
import { type Post } from "types/posts";
import { formatDate, truncateString } from "utils/formatting";

const HomePage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = React.useState(false);
  const { posts, fetchPosts, refetchPosts } = usePostStore();

  useFocusEffect(
    useCallback(() => {
      if (posts.length === 0) {
        fetchPosts().catch(() => {
          console.log("error fetching posts");
        });
      }
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchPosts().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={() => fetchPosts()}
        onEndReachedThreshold={0.9}
        style={{ minHeight: 50, width: screenWidth - 20, marginVertical: 10 }}
      />
    </SafeAreaView>
  );
};

const Post = ({ post }: { post: Post }) => {
  return (
    <Card style={{ padding: 20, marginBottom: 20 }}>
      <Link
        href={{
          pathname: "/(tabs)/(posts)/[id]",
          params: { id: post.id },
        }}
        asChild
      >
        <Pressable>
          <Text style={{ opacity: 0.5 }}>by {post.user.name} - {formatDate(post.created_at)}</Text>
          <Text variant="titleLarge" style={{ marginBottom: 15 }}>
            {post.title}
          </Text>
          <Text>{truncateString(post.body)}</Text>
        </Pressable>
      </Link>
    </Card>
  );
};

export default HomePage;
