export { type Comment } from './model/types/Comment';
export { type CommentsSchema } from './model/types/CommentsSchema';
export { commentsReducer } from './model/slice/commentsSlice';
export { getAllComments } from './model/selectors/commentSelectors';
export { fetchAllComments } from './model/services/fetchAllComments/fetchAllComments';
export { fetchCommentsByUserId } from './model/services/fetchCommentsByUserId/fetchCommentsByUserId';