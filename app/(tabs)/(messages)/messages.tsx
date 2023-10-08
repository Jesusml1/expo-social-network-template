import axios, { AxiosHeaders } from "axios";
import { API_URL } from "contanst";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View, useWindowDimensions, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Card, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "store/useAuthStore";
import { User } from "types/auth";

const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { token, user } = useAuthStore();
  // const { width: screenWidth } = useWindowDimensions();
  const [results, setResults] = useState<Array<User>>([]);

  useEffect(() => {
    if (searchQuery.length > 3) {
      handleSearchUser();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  async function handleSearchUser() {
    try {
      if (searchQuery !== "" && user) {
        const response = await axios.get(
          API_URL + "/search-users?username=" + searchQuery,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (response.status === 200) {
          const res = [...response.data.results].filter(
            (r) => r.id === user.id
          );
          setResults(res);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ margin: 10 }}>
      <Searchbar
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        placeholder="search user"
      />
      {/* <Link
        href={{
          pathname: "/(tabs)/(messages)/[id]",
          params: { id: 12 },
        }}
      >
        Go to chat room
      </Link> */}
      {searchQuery === "" && (
        <View
          style={{
            display: "flex",
            minHeight: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Search an user to start a chat</Text>
        </View>
      )}
      {results.length > 0 && (
        <SafeAreaView>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <Card style={{ padding: 20, marginBottom: 20 }}>
                <Link
                  href={{
                    pathname: "/(tabs)/(messages)/[id]",
                    params: { id: item.id },
                  }}
                  asChild
                >
                  <Pressable>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 20,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 50, aspectRatio: 1, borderRadius: 25 }}
                        source={{
                          uri: `https://ui-avatars.com/api/?name=${item.name}`,
                        }}
                      />
                      <Text variant="titleMedium">{item.name}</Text>
                    </View>
                  </Pressable>
                </Link>
              </Card>
            )}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

export default MessagesPage;
