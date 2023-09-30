import { formatDate } from "utils/formatting";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import usePostStore from "store/usePostStore";
import { RefreshControl } from "react-native-gesture-handler";
import useCommentStore from "store/useCommentStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Post = () => {
  const { id } = useLocalSearchParams();
  const { post, setPost, fetchSinglePost } = usePostStore();
  const { width: screenWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [refreshing, _] = useState(false);
  const { fetchComments } = useCommentStore();

  useEffect(() => {
    setPost(Number(id));
    setLoading(false);
  }, []);

  function onRefresh() {
    fetchSinglePost(Number(id));
    fetchComments(Number(id));
  }

  return (
    <SafeAreaView edges={["bottom", "left", "right"]}>
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
            <Text style={{ fontSize: 16 }}>{post.body}</Text>
          </Card>
        )}
        {post && <Comments />}
      </ScrollView>
    </SafeAreaView>
  );
};

function Comments() {
  const { id: postId } = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();
  const { comments, fetchComments, createComment } = useCommentStore();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments(Number(postId));
  }, []);

  function handleCreateComment() {
    setLoading(true);
    createComment(Number(postId), comment)
      .then(() => {
        setComment("");
        fetchComments(Number(postId));
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card style={{ width: screenWidth - 20, padding: 20, marginBottom: 20 }}>
      <TextInput
        placeholder="leave a comment..."
        mode="outlined"
        value={comment}
        onChangeText={(text) => setComment(text)}
        numberOfLines={4}
        multiline
        style={{ marginBottom: 10 }}
      />
      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <Button
          mode="contained"
          style={{ maxWidth: 150 }}
          onPress={handleCreateComment}
          loading={loading}
        >
          Comment
        </Button>
      </View>
      <Text style={{ fontWeight: "500", marginBottom: 20 }}>
        {comments.length} comments
      </Text>
      <View>
        {comments.map((c) => (
          <View key={c.id} style={{ marginBottom: 10 }}>
            <Text style={{ opacity: 0.5, fontSize: 12 }}>
              {c.user.name} - {formatDate(c.created_at)}
            </Text>
            <Text style={{ fontSize: 16 }}> {c.content} </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default Post;
