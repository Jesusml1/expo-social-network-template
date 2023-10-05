import axios from "axios";
import { API_URL, PUSHER_HOST, PUSHER_KEY_APP, PUSHER_PORT } from "contanst";
import { useFocusEffect } from "expo-router";
import PusherJs from "pusher-js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "store/useAuthStore";
import { User } from "types/auth";
import { formatDate } from "utils/formatting";

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
  const [nextCursor, setNextCursor] = useState<string>("");
  const { token, user } = useAuthStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [receivedMessage, setReceivedMessage] = useState<Message | null>(null);
  const messagesFlatlistRef = useRef<FlatList>(null);
  const [showGoDownButton, setShowGoDownButton] = useState<boolean>(false);

  const onChangeInput = (text: React.SetStateAction<string>) => setInput(text);
  const prevScrollPos = useRef(0);

  async function fetchMessages() {
    try {
      const response = await axios.get(
        API_URL + "/messages?cursor=" + nextCursor,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.status === 200) {
        setMessages([...messages, ...response.data.data]);
        setNextCursor(response.data.next_cursor);
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
          setMessages([response.data.message, ...messages]);
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
    fetchMessages();

    const client = new PusherJs(PUSHER_KEY_APP, {
      wsHost: PUSHER_HOST,
      wsPort: PUSHER_PORT,
      forceTLS: false,
      cluster: "",
      disableStats: false,
      enabledTransports: ["ws", "wss"],
    });
    client
      .subscribe("public")
      .bind("chat", ({ message: incommingMessage }: { message: Message }) => {
        setReceivedMessage(incommingMessage);
      });

    return () => {
      client.unsubscribe("public");
    };
  }, []);

  useEffect(() => {
    if (receivedMessage !== null) {
      setMessages([receivedMessage, ...messages]);
      setReceivedMessage(null);
    }
  }, [receivedMessage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     setPage(1);
  //     fetchMessages();
  //   }, [])
  // );

  const handleOnScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (showGoDownButton === false) {
        const verticalOffset = e.nativeEvent.contentOffset.y;
        if (prevScrollPos.current < verticalOffset) {
          setShowGoDownButton(true);
        }
      }
    },
    []
  );

  const MessageCard = useCallback(
    ({ message }: { message: Message }) => {
      const calculatedWidth =
        message.content.length > 75 ? "100%" : message.content.length * 20;
      return (
        <View
          style={{
            padding: 20,
            marginBottom: 20,
            backgroundColor: "#e5e7eb",
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
            <Text style={{ fontSize: 12 }}>
              {formatDate(message.created_at)}
            </Text>
          </View>
        </View>
      );
    },
    [messages]
  );

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        position: "relative",
        flex: 1,
      }}
    >
      {showGoDownButton && (
        <IconButton
          mode="contained"
          containerColor="white"
          icon="arrow-down"
          style={{ position: "absolute", zIndex: 10, bottom: 80, right: 5 }}
          onPress={() =>
            messagesFlatlistRef.current?.scrollToIndex({
              animated: true,
              index: 0,
            })
          }
        />
      )}
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageCard message={item} />}
        keyExtractor={(item) => item.created_at}
        refreshing={refreshing}
        onScroll={handleOnScroll}
        onRefresh={onRefresh}
        onEndReached={() => fetchMessages()}
        onStartReached={() => setShowGoDownButton(false)}
        inverted
        ref={messagesFlatlistRef}
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

export default ChatPage;
