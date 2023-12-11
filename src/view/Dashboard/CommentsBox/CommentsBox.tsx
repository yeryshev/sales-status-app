import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
// import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import {
  addComment,
  deleteComment,
  setMyComments,
} from '../../../features/comments/actions/commentsActions';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';
import { updateUser } from '../../../features/user/actions/userActions';
import { Comment } from '../../../types/Comment';
import AddIcon from '@mui/icons-material/Add';

const CommentsBox = () => {
  const [age, setAge] = useState('');
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [commentInput, setCommentInput] = useState('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const comments = useSelector((state: RootState) => state.comments.list);
  // const { socket } = useSocketCtx();

  useEffect(() => {
    if (user?.id) {
      dispatch(setMyComments(user.id));
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId]);

  const handlePickComment = useCallback(
    (commentId: number | null) => {
      if (user) {
        dispatch(updateUser({ ...user, commentId }))
          // .then(() => {
          //   socket.send(JSON.stringify({ userId: user.id, commentId }));
          // })
          .then(() => {
            setSelectedComment(null);
            setAge('');
          });
      }
    },
    [dispatch, user]
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
        if (user.commentId === commentId) {
          handlePickComment(null);
        }
        setSelectedComment(null);
        setAge('');
      });
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <>
      <FormLabel id="comments-label" sx={{ mb: 2 }}>
        Комментарии
      </FormLabel>
      <Box component="form" onSubmit={handleAddComment} mb={2}>
        <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={{ md: 1 }}>
          <Grid item xs={10} sm={10} md={10}>
            <TextField
              required
              name="comments"
              label="Создать новый"
              fullWidth
              type="text"
              id="comments"
              autoComplete="off"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
          </Grid>

          <Grid
            item
            sx={{ height: '100%' }}
            xs={2}
            sm={2}
            md={2}
            justifyContent={'center'}
            alignItems={'center'}
            display={'flex'}
          >
            <Button type="submit" sx={{ height: '100%' }}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="demo-simple-select-label">Выбрать</InputLabel>
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
      <Grid container justifyContent={'center'}>
        <Grid item>
          <Button
            type="button"
            onClick={() => handlePickComment(selectedComment?.id || null)}
            disabled={selectedComment === null}
            color="success"
          >
            Установить
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => handleDeleteComment(selectedComment?.id || 0)}
            disabled={selectedComment === null}
            color="error"
          >
            Удалить
          </Button>
        </Grid>
        <Grid item>
          <Button disabled={user?.commentId === null} onClick={() => handlePickComment(null)}>
            Очистить
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CommentsBox;
