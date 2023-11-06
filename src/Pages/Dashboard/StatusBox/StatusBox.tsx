import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { checkUser, updateUser } from '../../../features/user/actions/userActions';
import { setTeam } from '../../../features/team/actions/teamActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { TriggerButton, StyledListbox, StyledMenuItem, ClearButton } from './DropdownStyle';
import { Box, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddIcon from '@mui/icons-material/Add';
import {
  addComment,
  deleteComment,
  setComments,
} from '../../../features/comments/actions/commentsActions';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';

export default function StatusBox() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const [commentInput, setCommentInput] = useState('');
  const comments = useSelector((state: RootState) => state.comments.list);
  const status = useSelector((state: RootState) => state.status.value);

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

    const handleSocketMessage = (message: MessageEvent) => {
      const arg = JSON.parse(message.data);
      if (arg.action === 'change-status' || arg.action === 'change-comment') {
        handleStatusChange();
      }
    };

    socket.onmessage = handleSocketMessage;

    return () => {
      socket.removeEventListener('message', handleSocketMessage);
      socket.removeEventListener('message', handleSocketMessage);
    };
  }, [socket, dispatch, user?.statusId]);

  const handlePickComment = useCallback(
    (statusId: number | null) => {
      if (user) {
        dispatch(updateUser({ ...user, commentId: statusId })).then(() => {
          socket.send(
            JSON.stringify({
              action: 'change-comment',
              userId: user.id,
              statusId,
            })
          );
        });
      }
    },
    [socket, dispatch, user]
  );

  const handleChangeMainStatus = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const statusId = Number(event.target.value);
    if (user) {
      dispatch(updateUser({ ...user, statusId: statusId })).then(() => {
        socket.send(
          JSON.stringify({
            action: 'change-status',
            userId: user.id,
            statusId,
          })
        );
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

  return (
    <FormControl
      sx={{
        gap: 3,
      }}
    >
      <FormLabel id="main-radio-label">Мой статус</FormLabel>
      <RadioGroup
        aria-labelledby="main-radio-label"
        value={status}
        name="main-status-radio"
        onChange={handleChangeMainStatus}
      >
        <FormControlLabel value={1} control={<Radio />} label="На связи" />
        <FormControlLabel value={2} control={<Radio />} label="Занят" />
        <FormControlLabel value={3} control={<Radio />} label="Недоступен" />
      </RadioGroup>
      <Box sx={{ display: 'flex', gap: 1 }}>
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
