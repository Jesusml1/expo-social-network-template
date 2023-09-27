import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button } from "react-native-paper";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          headerTitle: "Search",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createPost"
        options={{
          tabBarLabel: "Post",
          headerTitle: "Create Post",
          headerRight: () => (
            <Button
              mode="contained"
              style={{ borderRadius: 5, marginRight: 10 }}
            >
              Post
            </Button>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          headerTitle: "Messages",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="envelope" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Account",
          headerTitle: "My account",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
