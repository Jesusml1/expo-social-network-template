import { User } from "./auth";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user: User
};