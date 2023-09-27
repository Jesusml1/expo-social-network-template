import {
  FlatList,
  useWindowDimensions,
  Alert,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text } from "react-native-paper";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

type Post = {
  user_id: number;
  id: number;
  title: string;
  body: string;
};

const HomePage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = React.useState(false);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [page, setPage] = useState(1);

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
      if(posts.length === 0){
        fetchPosts();
      }
    }, [])
  );

  async function fetchPosts() {
    try {
      const userToken = await SecureStore.getItemAsync("token");
      const response = await axios.get(
        "http://192.168.100.98:8000/api/posts?page=" + page,
        {
          headers: { Authorization: "Bearer " + userToken },
        }
      );
      if (response.status === 200) {
        console.log('fetching page ' + page);
        setPosts([...posts, ...response.data.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function getPosts() {
      try {
        const userToken = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://192.168.100.98:8000/api/posts?page=" + page,
          {
            headers: { Authorization: "Bearer " + userToken },
          }
        );
        if (response.status === 200) {
          setPage(1);
          setPosts(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setRefreshing(false);
      }
    }

    getPosts();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
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
      <Button>More</Button>
    </Card>
  );
};

export default HomePage;
