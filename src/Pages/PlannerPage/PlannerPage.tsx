import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
} from '@mui/material';
import Layout from '../../components/Layout/Layout';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormEvent, useEffect, useState } from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { TriggerButton, StyledListbox, StyledMenuItem, ClearButton } from './DropdownStyle';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddIcon from '@mui/icons-material/Add';
import Title from './Title';
import { RootState, useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { User } from '../../types/User';
import {
  addComment,
  deleteComment,
  setComments,
} from '../../features/comments/actions/commentsActions';
import { addTask, deleteTask, setTasks } from '../../features/tasks/actions/tasksActions';
import { useSocketCtx } from '../../helpers/contexts/wsContext';
import { removeTask } from '../../features/tasks/slice/tasksSlice';
import { ru } from 'date-fns/locale';

const Planner = () => {
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const comments = useSelector((state: RootState) => state.comments.list);
  const tasks = useSelector((state: RootState) => state.tasks.list);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [statusId, setStatusId] = useState(1);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(setComments());
      dispatch(setTasks());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const handleTaskDone = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      dispatch(removeTask(data.uuid));
    };

    socket.addEventListener('message', handleTaskDone);

    return () => {
      socket.removeEventListener('message', handleTaskDone);
    };
  }, [dispatch, socket]);

  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.id) {
      dispatch(addComment({ comment: commentInput })).then(() => {
        setCommentInput('');
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment(commentId));
  };

  const handleSubmitTask = ({
    date,
    statusId,
    commentId,
  }: {
    date: Date;
    statusId: number;
    commentId: number | null;
  }) => {
    dispatch(addTask({ date, statusId, commentId }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (user?.id) {
      dispatch(deleteTask(taskId));
    }
  };

  return (
    <Layout>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item>
              <Title>Отложенные статусы</Title>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={3} direction={'column'} alignItems={'center'}>
                  <Grid item sx={{ width: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                      <DateTimePicker
                        label="Запланировать"
                        ampm={false}
                        sx={{ width: '100%' }}
                        minDateTime={new Date()}
                        timezone="Europe/Moscow"
                        value={selectedDateTime}
                        onChange={(date) => {
                          setSelectedDateTime(date);
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      aria-labelledby="main-radio-label"
                      value={statusId}
                      name="main-status-radio"
                      row
                      onChange={(e) => setStatusId(Number(e.target.value))}
                    >
                      <FormControlLabel value={1} control={<Radio />} label="На связи" />
                      <FormControlLabel value={2} control={<Radio />} label="Занят" />
                      <FormControlLabel value={3} control={<Radio />} label="Недоступен" />
                    </RadioGroup>
                  </Grid>
                  <Grid item sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Dropdown>
                          <TriggerButton>
                            {selectedComment
                              ? `Комментарий: ${
                                  comments.find((c) => c.id === selectedComment)?.description
                                }`
                              : 'Выбрать комментарий'}
                          </TriggerButton>
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
                                  onClick={() => setSelectedComment(comment.id)}
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
                              sx={{
                                marginY: 1,
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'space-between',
                              }}
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
                      {selectedComment && (
                        <ClearButton onClick={() => setSelectedComment(null)}>
                          <BackspaceIcon />
                        </ClearButton>
                      )}
                    </Box>
                  </Grid>

                  <Grid item sx={{ width: '100%' }}>
                    <Button
                      sx={{ width: '100%' }}
                      type="button"
                      variant="outlined"
                      disabled={!selectedDateTime}
                      onClick={() =>
                        handleSubmitTask({
                          date: selectedDateTime || new Date(),
                          statusId,
                          commentId: comments.find((c) => c.id === selectedComment)?.id || null,
                        })
                      }
                    >
                      Создать
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {tasks.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Дата</TableCell>
                          <TableCell>Время</TableCell>
                          <TableCell>Статус</TableCell>
                          <TableCell>Комментарий</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow
                            key={task.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(task.date).toLocaleTimeString()}</TableCell>
                            <TableCell>
                              {task.statusId === 1
                                ? 'На связи'
                                : task.statusId === 2
                                ? 'Занят'
                                : 'Недоступен'}
                            </TableCell>
                            <TableCell>
                              {comments.find((c) => c.id === task.commentId)?.description}
                            </TableCell>
                            <TableCell align="right">
                              <Button type="button" onClick={() => handleDeleteTask(task.uuid)}>
                                Отменить
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Planner;
