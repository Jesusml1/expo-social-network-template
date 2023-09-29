import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  useWindowDimensions
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import usePostStore from "store/usePostStore";

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

const HomePage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = React.useState(false);
  const { posts, fetchPosts, refetchPosts } = usePostStore();

  const backActionHandler = () => {
    Alert.alert("Are you sure?", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Yes", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

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
      setRefreshing(false)
    });
  }, []);

  return (
    <SafeAreaView
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
        style={{ minHeight: 50, width: screenWidth - 20 }}
      />
    </SafeAreaView>
  );
};

const Post = ({ post }: { post: Post }) => {
  return (
    <Card style={{ padding: 20, marginBottom: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 10 }}>
        {post.title}
      </Text>
      <Text>{post.body}</Text>
      <Link
        style={{ marginTop: 10 }}
        href={{
          pathname: "/(tabs)/(posts)/[id]",
          params: { id: post.id },
        }}
      >
        <Button mode="outlined">View post</Button>
      </Link>
    </Card>
  );
};

export default HomePage;
