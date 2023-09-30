import { User } from "./auth";

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  user: User;
};

export interface CommentStore {
  comments: Array<Comment>;
  fetchComments: (postId: number) => Promise<void>;
  createComment: (postId: number, content: string) => Promise<void>;
  clearComments: () => void;
}