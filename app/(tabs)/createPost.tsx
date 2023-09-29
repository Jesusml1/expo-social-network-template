import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { TextInput as RNTextInput, View, useWindowDimensions } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import usePostStore from "store/usePostStore";

const CreatePostPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { title, body, setBody, setTitle, errors } = usePostStore();

  const titleInputRef = useRef<RNTextInput>(null);

  useFocusEffect(
    useCallback(() => {
      titleInputRef.current?.focus();
    }, [])
  );

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <View style={{ width: screenWidth - 40, marginTop: 40 }}>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholder="Title"
            mode="outlined"
            value={title}
            onChangeText={(text) => setTitle(text)}
            error={errors?.errors?.title && true}
            ref={titleInputRef}
          />
          <HelperText type="error">
            {errors?.errors?.title && errors?.errors?.title[0]}
          </HelperText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholder="Body"
            mode="outlined"
            value={body}
            onChangeText={(text) => setBody(text)}
            numberOfLines={10}
            multiline
            error={errors?.errors?.body && true}
          />
          <HelperText type="error">
            {errors?.errors?.body && errors?.errors?.body[0]}
          </HelperText>
        </View>
      </View>
    </View>
  );
};

export default CreatePostPage;
