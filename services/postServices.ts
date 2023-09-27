import axios, { AxiosError } from "axios";
import { API_URL } from "../contanst";

export async function getPosts(page: number) {
  try {
    const response = await axios(API_URL + "/posts?page=" + page);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response.data;
      }
    }
  }
}
