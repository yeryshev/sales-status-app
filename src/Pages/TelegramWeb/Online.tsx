import { useSocketCtx } from '../../helpers/contexts/wsContext';
import { RootState, useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { checkUser, updateUser } from '../../features/user/actions/userActions';
import { setTeam } from '../../features/team/actions/teamActions';
import FormControl from '@mui/material/FormControl';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { TriggerButton, StyledListbox, StyledMenuItem, ClearButton } from './ButtonsTGStyle';
import { Box, Button, TextField, Card } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddIcon from '@mui/icons-material/Add';
import {
  addComment,
  deleteComment,
  setComments,
} from '../../features/comments/actions/commentsActions';
import { changeStatus } from '../../features/statuses/slice/statusSlice';

export default function StatusBox() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const [commentInput, setCommentInput] = useState('');
  const comments = useSelector((state: RootState) => state.comments.list);

  useEffect(() => {
    if (user?.id) {
      dispatch(setComments(user?.id));
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId]);

  useEffect(() => {
    const handleStatusChange = () => {
      dispatch(checkUser());
      dispatch(setTeam());
      dispatch(changeStatus(user?.statusId));
    };

    socket.on('change-status', handleStatusChange);
    socket.on('change-comment', handleStatusChange);

    return () => {
      socket.off('change-status', handleStatusChange);
      socket.off('change-comment', handleStatusChange);
    };
  }, [socket, dispatch, user?.statusId]);

  const handlePickComment = useCallback(
    (statusId: number | null) => {
      if (user) {
        dispatch(updateUser({ ...user, commentId: statusId })).then(() => {
          socket.emit('change-comment', { userId: user.id, statusId: 1 });
        });
      }
    },
    [socket, dispatch, user]
  );

  const handleChangeMainStatus = () => {
    const statusId = Number(1);
    if (user) {
      dispatch(updateUser({ ...user, statusId: statusId })).then(() => {
        socket.emit('change-status', { userId: user.id, statusId });
      });
    }
  };
  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.id) {
      dispatch(addComment({ comment: commentInput, userId: user?.id })).then(() => {
        setCommentInput('');
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (user?.id) {
      dispatch(deleteComment(commentId));
    }
  };

  useEffect(() => {
    handleChangeMainStatus();
  }, []);

  return (
    <FormControl sx={{ width: '100%', gap: 1 }}>
      <Card style={{ margin: '10px', padding: '10px' }}>🟢 Ты теперь онлайн</Card>
      <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Dropdown>
            <TriggerButton>Добавить комментарий</TriggerButton>
            <Menu slots={{ listbox: StyledListbox }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <StyledMenuItem
                    key={comment.id}
                    onClick={() => handlePickComment(comment.id)}
                    sx={{
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    {comment.description}
                  </StyledMenuItem>
                  <DeleteIcon
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
              <Box
                component="form"
                sx={{ marginY: 1, display: 'flex', gap: 1, justifyContent: 'space-between' }}
                onSubmit={handleAddComment}
              >
                <TextField
                  name="comment"
                  required
                  autoComplete="off"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  inputProps={{
                    maxLength: 30,
                  }}
                  size="small"
                  style={{ flexGrow: 1 }}
                />
                <Button type="submit" variant="outlined">
                  <AddIcon />
                </Button>
              </Box>
            </Menu>
          </Dropdown>
        </Box>
        <ClearButton disabled={user?.commentId === null} onClick={() => handlePickComment(null)}>
          <BackspaceIcon />
        </ClearButton>
      </Box>
    </FormControl>
  );
}
