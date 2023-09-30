import { User } from "./auth";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user: User;
};

export type NewPost = {
  user_id: number;
  title: string;
  body: string;
};

export interface InputErrors {
  title: Array<string>;
  body: Array<string>;
}

export interface PostStore {
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
  setPost: (id: number) => void;
  fetchSinglePost: (id: number) => Promise<void>;

  setTitle: (text: string) => void;
  setBody: (text: string) => void;
  createPost: () => Promise<boolean>;
}
