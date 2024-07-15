import { memo, useCallback, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { getUserData, updateUser } from '@/entities/User';
import { deleteComment, fetchCommentsByUserId, getUserComments } from '@/entities/Comment';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { selectCommentFormActions, selectCommentFormReducer } from '../model/slices/selectCommentFormSlice';
import { getCommentSelectItem } from '../model/selectors/selectCommentFormSelectors';

const reducers: ReducersList = {
  selectComment: selectCommentFormReducer,
};

export const SelectCommentForm = memo(() => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const userComments = useSelector(getUserComments);
  const comment = useSelector(getCommentSelectItem);

  useEffect(() => {
    user && dispatch(fetchCommentsByUserId(user.id));
  }, [dispatch, user]);

  const handlePickComment = useCallback(() => {
    user && dispatch(updateUser({ user: { ...user, commentId: comment?.id || null } }));
    comment && dispatch(selectCommentFormActions.setCommentItem(undefined));
  }, [comment, dispatch, user]);

  const handleClearComment = useCallback(() => {
    user && dispatch(updateUser({ user: { ...user, commentId: null } }));
  }, [dispatch, user]);

  const handleDeleteComment = useCallback(() => {
    comment && dispatch(deleteComment(comment?.id));
    dispatch(selectCommentFormActions.setCommentItem(undefined));
  }, [comment, dispatch]);

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const comment = userComments.find((comment) => comment.id === Number(event.target.value));
      dispatch(selectCommentFormActions.setCommentItem(comment));
    },
    [dispatch, userComments],
  );

  return (
    <DynamicModuleLoader reducers={reducers}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="select-comment-form-label" size={'small'}>
          Выбрать
        </InputLabel>
        <Select
          labelId="select-comment-form-labell"
          id="select-comment-form"
          value={comment ? String(comment.id) : ''}
          onChange={handleChange}
          label="Выбрать комментарий"
          size={'small'}
        >
          {userComments.map((comment) => (
            <MenuItem key={comment.id} value={comment.id} disabled={user?.commentId === comment.id}>
              {comment.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container justifyContent={'center'}>
        <Grid>
          <Button type="button" onClick={handlePickComment} disabled={!comment} color="success" size={'small'}>
            Установить
          </Button>
        </Grid>
        <Grid>
          <Button onClick={handleDeleteComment} disabled={!comment} color="error" size={'small'}>
            Удалить
          </Button>
        </Grid>
        <Grid>
          <Button disabled={user?.commentId === null} size={'small'} onClick={handleClearComment}>
            Очистить
          </Button>
        </Grid>
      </Grid>
    </DynamicModuleLoader>
  );
});
