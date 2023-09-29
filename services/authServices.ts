import axios from "axios";
import { API_URL } from "contanst";
import { signInCredentials, signUpCredentials } from "types/auth";

export async function signUp(credentials: signUpCredentials) {
  const response = await axios.post(API_URL + "/register", credentials);

  return response;
}

export async function signIn(credentials: signInCredentials) {
  const response = await axios.post(API_URL + "/login", credentials);

  return response;
}

export async function signOut(userToken: string) {
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.post(API_URL + "/logout", {}, { headers });

  return response;
}
