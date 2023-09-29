import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { useRouter } from "expo-router";
import useAuthStore from "store/useAuthStore";
import { signUpCredentials } from "types/auth";

const RegisterPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const { signUpUser, errors } = useAuthStore();

  function handleRegister() {
    setLoading(true);
    const credentials: signUpCredentials = {
      name: username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };
    signUpUser(credentials)
      .then((success) => {
        if (success) {
          router.push("/(tabs)/(posts)/home");
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
    setUsername("");
    setPasswordConfirmation("");
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
        Register
      </Text>
      <View style={{ width: screenWidth - 40 }}>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={(username) => setUsername(username)}
            mode="outlined"
            autoComplete="username"
            error={errors?.errors?.name ? true : false}
          />
          <HelperText type="error">
            {errors?.errors?.name && errors?.errors?.name[0]}
          </HelperText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
            mode="outlined"
            autoComplete="email"
            error={errors?.errors?.email && true}
          />
          <HelperText type="error">
            {errors?.errors?.name && errors?.errors?.name[0]}
          </HelperText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            mode="outlined"
            autoComplete="password"
            error={errors?.errors?.password && true}
          />
          <HelperText type="error">
            {errors?.errors?.password && errors?.errors?.password[0]}
          </HelperText>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            label="Password confirmation"
            value={passwordConfirmation}
            secureTextEntry={true}
            onChangeText={(passwordConfirmation) =>
              setPasswordConfirmation(passwordConfirmation)
            }
            mode="outlined"
            autoComplete="password"
            error={errors?.errors?.password && true}
          />
        </View>
        <Button
          mode="contained"
          onPress={() => handleRegister()}
          style={{ marginVertical: 20, borderRadius: 5 }}
          loading={loading}
        >
          Register
        </Button>
      </View>
    </View>
  );
};

export default RegisterPage;
