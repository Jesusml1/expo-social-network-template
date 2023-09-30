import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Card, Searchbar } from "react-native-paper";

const SearchPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
      <View style={{ width: screenWidth - 40 }}>
        <Card style={{ height: 100, padding: 10, marginBottom: 40, marginTop: 10 }}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </Card>
      </View>
    </View>
  );
};

export default SearchPage;
