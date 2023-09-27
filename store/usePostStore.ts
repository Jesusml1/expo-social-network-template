import axios, { AxiosError } from "axios";
import { API_URL } from "../contanst";
import { ValidationErrors } from "../types/types";
import { create } from "zustand";

type NewPost = {
  user_id: number;
  title: string;
  body: string;
};

interface InputErrors {
  title: Array<string>;
  body: Array<string>;
}

interface PostStore {
  title: string;
  body: string;
  errors: {
    message: string;
    errors: InputErrors | null;
  } | null;
  setTitle: (text: string) => void;
  setBody: (text: string) => void;
  createPost: (userId: number, userToken: string) => Promise<boolean>;
}

const usePostStore = create<PostStore>()((set, get) => ({
  title: "",
  body: "",
  errors: null,
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
  createPost: async (userId: number, userToken: string) => {
    try {
      const newPost = {
        user_id: userId,
        title: get().title,
        body: get().body,
      } as NewPost;

      const response = await axios.post(API_URL + "/posts", newPost, {
        headers: { Authorization: "Bearer " + userToken },
      });
      if (response.status === 201) {
        set((state) => ({
          ...state,
          title: "",
          body: "",
          errors: null,
        }));
        console.log("post created");
        return true;
      }
      return false;
    } catch (error) {
      let e = error as AxiosError<ValidationErrors>;
      if (axios.isAxiosError(e)) {
        if (e.response !== undefined) {
          if (e.response.status === 422) {
            console.log(e.response.data)
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
