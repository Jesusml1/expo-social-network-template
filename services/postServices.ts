import axios from "axios";
import { API_URL } from "contanst";
import useAuthStore from "store/useAuthStore";
import { NewPost } from "types/posts";

export async function getPosts(page: number) {
  const userToken = useAuthStore.getState().token;
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.get(`${API_URL}/posts?page=${page}`, {
    headers,
  });
  return response;
}

export async function getSinglePost(id: number) {
  const userToken = useAuthStore.getState().token;
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.get(`${API_URL}/posts/${id}`, {
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

export async function getComments(postId: number) {
  const userToken = useAuthStore.getState().token;
  const headers = { Authorization: `Bearer ${userToken}` };
  const response = await axios.get(API_URL + "/comments/" + postId, {
    headers,
  });
  return response;
}

export async function storeComment(postId: number, content: string) {
  const { token: userToken, user } = useAuthStore.getState();
  const response = await axios.post(
    API_URL + "/comments",
    { post_id: postId, user_id: user?.id, content },
    { headers: { Authorization: "Bearer " + userToken } }
  );
  return response;
}
