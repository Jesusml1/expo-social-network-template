import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { API_URL } from "contanst";
import { ValidationErrors } from "types/types";

import useAuthStore from "./useAuthStore";
import { getPosts, storePost } from "services/postServices";

export type NewPost = {
  user_id: number;
  title: string;
  body: string;
};

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

interface InputErrors {
  title: Array<string>;
  body: Array<string>;
}

interface PostStore {
  posts: Array<Post>;
  post: Post | null;
  page: number;

  title: string;
  body: string;
  errors: {
    message: string;
    errors: InputErrors | null;
  } | null;

  fetchPosts: () => Promise<void>;
  refetchPosts: () => Promise<void>;

  setTitle: (text: string) => void;
  setBody: (text: string) => void;
  createPost: () => Promise<boolean>;
}

const usePostStore = create<PostStore>()((set, get) => ({
  posts: [],
  post: null,
  page: 1,

  title: "",
  body: "",
  errors: null,

  fetchPosts: async () => {
    try {
      const response = await getPosts(get().page);
      if (response.status === 200) {
        set((state) => ({
          ...state,
          page: state.page + 1,
          posts: [...state.posts, ...response.data.data],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  },

  refetchPosts: async () => {
    try {
      const response = await getPosts(1);
      if (response.status === 200) {
        set((state) => ({
          ...state,
          page: 2,
          posts: [...response.data.data],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  },

  setTitle: (text: string) => {
    set((state) => ({
      ...state,
      title: text,
    }));
  },
  setBody: (text: string) => {
    set((state) => ({
      ...state,
      body: text,
    }));
  },
  createPost: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        const newPost: NewPost = {
          user_id: userId,
          title: get().title,
          body: get().body,
        };
        const response = await storePost(newPost);
        if (response.status === 201) {
          set((state) => ({
            ...state,
            title: "",
            body: "",
            errors: null,
          }));
          return true;
        }
      }
      return false;
    } catch (error) {
      let e = error as AxiosError<ValidationErrors>;
      if (axios.isAxiosError(e)) {
        if (e.response !== undefined) {
          if (e.response.status === 422) {
            console.log(e.response.data);
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
}));

export default usePostStore;
