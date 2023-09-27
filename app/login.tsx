import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import useAuthStore from "../store/useAuthStore";
import { signInCredentials } from "../types/auth";

const LoginPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);

  const { user, errors, signInUser, getUser } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      getUser().then(() => {
        if (user !== null) {
          router.push("/(tabs)/home");
        }
      });
    }, [])
  );

  function handleLogin() {
    setLoading(true);
    const credentials: signInCredentials = { email, password };
    signInUser(credentials)
      .then((success) => {
        if (success) {
          router.push("/(tabs)/home");
          clearInputs();
        } else if (!success) {
          setVisible(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        {JSON.stringify(errors?.message)}
      </Snackbar>
      <Text
        variant="headlineLarge"
        style={{ color: "black", marginBottom: 40 }}
      >
        Login
      </Text>
      <View style={{ width: screenWidth - 40 }}>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
            mode="outlined"
            error={errors?.errors?.email && true}
          />
          <HelperText type="error">
            {errors?.errors?.email && errors?.errors?.email[0]}
          </HelperText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            mode="outlined"
            error={errors?.errors?.password && true}
          />
          <HelperText type="error">
            {errors?.errors?.password && errors?.errors?.password[0]}
          </HelperText>
        </View>
        <Button
          mode="contained"
          onPress={() => handleLogin()}
          style={{ marginBottom: 20, borderRadius: 5 }}
          loading={loading}
        >
          Enter
        </Button>
      </View>
      <Link href="/register" asChild>
        <Pressable>
          <Text> Don't have an account? Register </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default LoginPage;
