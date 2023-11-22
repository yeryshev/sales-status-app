import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import {
  addComment,
  deleteComment,
  setComments,
} from '../../../features/comments/actions/commentsActions';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';
import { updateUser } from '../../../features/user/actions/userActions';
import { Comment } from '../../../types/Comment';

const CommentsBox = () => {
  const [age, setAge] = useState('');
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [commentInput, setCommentInput] = useState('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const comments = useSelector((state: RootState) => state.comments.list);
  const { socket } = useSocketCtx();

  useEffect(() => {
    if (user?.id) {
      dispatch(setComments());
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId]);

  const handlePickComment = useCallback(
    (commentId: number | null) => {
      if (user) {
        dispatch(updateUser({ ...user, commentId }))
          .then(() => {
            socket.send(JSON.stringify({ userId: user.id, commentId }));
          })
          .then(() => {
            setSelectedComment(null);
            setAge('');
          });
      }
    },
    [socket, dispatch, user]
  );

  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.id) {
      dispatch(addComment({ comment: commentInput })).then(() => {
        setCommentInput('');
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (user?.id) {
      dispatch(deleteComment(commentId)).then(() => {
        setSelectedComment(null);
      });
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <>
      <FormLabel id="comments-label">Комментарии</FormLabel>
      <Box component="form" onSubmit={handleAddComment}>
        <TextField
          margin="dense"
          required
          fullWidth
          name="comments"
          label="Новый комментарий"
          size="small"
          type="text"
          id="comments"
          autoComplete="off"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <Button type="submit" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} size="small">
          Добавить
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Выбрать комментарий</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Выбрать комментарий"
          onChange={handleChange}
        >
          {comments.map((comment) => (
            <MenuItem
              key={comment.id}
              value={comment.id}
              onClick={() => setSelectedComment(comment)}
            >
              {comment.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'start', mt: 2, gap: 1 }}>
        <Button
          type="button"
          onClick={() => handlePickComment(selectedComment?.id || null)}
          disabled={selectedComment === null}
          variant="contained"
          endIcon={<SendIcon />}
          size="small"
          color="success"
        >
          Установить
        </Button>
        <Button
          onClick={() => handleDeleteComment(selectedComment?.id || 0)}
          disabled={selectedComment === null}
          endIcon={<DeleteIcon />}
          color="error"
          variant="contained"
          size="small"
        >
          Удалить
        </Button>
        <Button
          disabled={user?.commentId === null}
          onClick={() => handlePickComment(null)}
          variant="contained"
          endIcon={<BackspaceIcon />}
          size="small"
        >
          Очистить
        </Button>
      </Box>
    </>
  );
};

export default CommentsBox;
