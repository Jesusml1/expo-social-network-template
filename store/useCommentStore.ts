import { create } from "zustand";
import { CommentStore } from "types/comments";
import { getComments, storeComment } from "services/postServices";

const useCommentStore = create<CommentStore>()((set, get) => ({
  comments: [],
  fetchComments: async (postId: number) => {
    try {
      const response = await getComments(postId);
      if (response.status === 200) {
        set((state) => ({
          comments: response.data,
        }));
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  createComment: async (postId: number, content: string) => {
    try {
      const response = await storeComment(postId, content);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  clearComments: () => {
    set((state) => ({ ...state, comments: [] }));
  },
}));

export default useCommentStore;
