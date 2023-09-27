import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../contanst";
import {
  SignInResponse,
  User,
  ValidationErrors,
  signInCredentials,
  signUpCredentials,
} from "../types/auth";

export async function signUp(credentials: signUpCredentials) {
  try {
    const response = await axios.post(API_URL + "/register", credentials);
    if (response.status === 201) {
      return response;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response.data;
      }
    }
  }
}

export async function signIn(
  credentials: signInCredentials
): Promise<SignInResponse | ValidationErrors | undefined> {
  try {
    const response = await axios.post(API_URL + "/login", credentials);
    if (response.data) {
      const user: User = response.data.user;
      const token: string = response.data.user;
      return { user, token };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.status === 419 && error.response.data) {
        const validationErrors: ValidationErrors = {
          message: error.response.data.message,
          errors: error.response.data.errors,
        };
        return validationErrors;
      } else {
        // if(error.)
        // const validationErrors: ValidationErrors = {
        //   message: error.response.data,
        //   errors: {},
        // };
        // return validationErrors;
      }
    } else {
      throw error;
    }
  }
}

export async function signOut(userToken: string) {
  try {
    const response = await axios.post(
      API_URL + "/logout",
      {},
      { headers: { Authorization: "Bearer " + userToken } }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response.data;
      }
    }
  }
}
