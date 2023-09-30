import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { signIn, signOut, signUp } from "services/authServices";
import {
  AuthStore,
  InputErrors,
  ValidationErrors,
  signInCredentials,
  signUpCredentials
} from "types/auth";
import { create } from "zustand";

const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  token: null,
  errors: null,
  getUser: async () => {
    const user = await SecureStore.getItemAsync("user");
    const token = await SecureStore.getItemAsync("token");

    if (user !== null && token !== null) {
      set((state) => ({
        ...state,
        user: JSON.parse(user),
        token: token,
      }));
    }
  },
  signInUser: async (credentials: signInCredentials): Promise<boolean> => {
    try {
      const response = await signIn(credentials);
      if (response.data && response.status === 200) {
        const { user, token } = response.data;
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        await SecureStore.setItemAsync("token", token);
        set((state) => ({
          ...state,
          errors: { message: "", errors: null },
          user: user,
          token: token,
        }));
        return true;
      }
      return false;
    } catch (error) {
      let e = error as AxiosError<ValidationErrors>;
      if (axios.isAxiosError(e)) {
        if (e.response !== undefined) {
          if (e.response.status === 422) {
            if (
              e.response.data !== undefined &&
              e.response.data.message &&
              e.response.data.errors
            ) {
              set((state) => ({
                ...state,
                errors: {
                  message: e.response?.data.message || "",
                  errors: (e.response?.data.errors as InputErrors) || {},
                },
              }));
            }
          }
          if (e.response.status === 401) {
            set((state) => ({
              ...state,
              errors: {
                message: e.response?.data.message || "",
                errors: null,
              },
            }));
          }
        }
      } else {
        throw error;
      }
      return false;
    }
  },
  signUpUser: async (credentials: signUpCredentials): Promise<boolean> => {
    try {
      const response = await signUp(credentials);
      if (response.data && response.status === 201) {
        const { user, token } = response.data;
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        await SecureStore.setItemAsync("token", token);
        set((state) => ({
          ...state,
          errors: { message: "", errors: null },
          user: user,
          token: token,
        }));
        return true;
      }
      return false;
    } catch (error) {
      let e = error as AxiosError<ValidationErrors>;
      if (axios.isAxiosError(e)) {
        if (e.response !== undefined) {
          if (e.response.status === 422) {
            if (
              e.response.data !== undefined &&
              e.response.data.message &&
              e.response.data.errors
            ) {
              set((state) => ({
                ...state,
                errors: {
                  message: e.response?.data.message || "",
                  errors: (e.response?.data.errors as InputErrors) || {},
                },
              }));
            }
          }
          if (e.response.status === 401) {
            set((state) => ({
              ...state,
              errors: {
                message: e.response?.data.message || "",
                errors: null,
              },
            }));
          }
        }
      } else {
        throw error;
      }
      return false;
    }
  },
  signOutUser: async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
      const userToken = get().token;
      if (userToken) {
        const response = await signOut(userToken);
        if (response) {
          console.log(response.data);
        }

        set((state) => ({
          ...state,
          user: null,
          token: null,
          errors: null,
        }));
      }
    } catch (error) {
    }
  },
  clearErrors() {
    set((state) => ({
      ...state,
      errors: null,
    }));
  },
}));

export default useAuthStore;
