import axios from "axios";
import { API_URL } from "contanst";
import useAuthStore from "store/useAuthStore";
import { NewPost } from "store/usePostStore";

export async function getPosts(page: number) {
  const userToken = useAuthStore.getState().token;
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.get(`${API_URL}/posts?page=${page}`, {
    headers,
  });
  return response;
}

export async function storePost(newPost: NewPost) {
  const userToken = useAuthStore.getState().token;
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.post(`${API_URL}/posts`, newPost, {
    headers,
  });
  return response;
}
