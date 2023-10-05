import axios from "axios";
import { API_URL, PUSHER_HOST, PUSHER_KEY_APP, PUSHER_PORT } from "contanst";
import { useFocusEffect } from "expo-router";
import PusherJs from "pusher-js";
import React, { useCallback, useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "store/useAuthStore";
import { User } from "types/auth";
import { formatDate } from "utils/formatting";

let client = new PusherJs(PUSHER_KEY_APP, {
  wsHost: PUSHER_HOST,
  wsPort: PUSHER_PORT,
  forceTLS: false,
  cluster: "",
  disableStats: false,
  enabledTransports: ["ws", "wss"],
});

type Message = {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  user: User;
};

const ChatPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const { token, user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onChangeInput = (text: React.SetStateAction<string>) => setInput(text);

  async function fetchMessages() {
    try {
      console.log("fetching messages");
      const response = await axios.get(API_URL + "/messages", {
        headers: { Authorization: "Bearer " + token },
      });
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function sendMessage() {
    try {
      if (user) {
        const response = await axios.post(
          API_URL + "/messages",
          {
            user_id: user.id,
            content: input,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (response.status === 201) {
          setInput("");
          setMessages([...messages, response.data.message]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleSendMessage() {
    sendMessage();
  }

  useEffect(() => {
    client
      .subscribe("public")
      .bind("chat", ({ message: incommingMessage }: { message: Message }) => {
        setMessages([...messages, incommingMessage]);
      });

    return () => {
      client.unsubscribe("public");
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [])
  );

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flex: 1,
      }}
    >
      <FlatList
        data={[...messages].reverse()}
        renderItem={({ item }) => <MessageCard message={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        extraData={messages}
        inverted
        style={{
          minHeight: 50,
          display: "flex",
          width: screenWidth - 20,
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: screenWidth - 20,
          marginBottom: 15,
          marginHorizontal: 10,
          alignItems: "center",
          columnGap: 5,
        }}
      >
        <TextInput
          label="send message..."
          value={input}
          onChangeText={(text) => onChangeInput(text)}
          mode="outlined"
          style={{ width: screenWidth - 110 }}
        />
        <Button
          mode="contained"
          style={{ height: 45 }}
          onPress={handleSendMessage}
        >
          Send
        </Button>
      </View>
    </SafeAreaView>
  );
};

const MessageCard = ({ message }: { message: Message }) => {
  const calculatedWidth =
    message.content.length > 75 ? "100%" : message.content.length * 20;
  return (
    <View
      style={{
        padding: 20,
        marginBottom: 20,
        backgroundColor: "#aaaaaa",
        borderRadius: 5,
        width: calculatedWidth,
        minWidth: 200,
      }}
    >
      <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
        {message.user.name}
      </Text>
      <Text style={{ fontSize: 16 }}>{message.content}</Text>
      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <Text style={{ fontSize: 12 }}>{formatDate(message.created_at)}</Text>
      </View>
    </View>
  );
};

export default ChatPage;
