import { FormEvent, memo, useCallback, useState } from 'react';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice';
import { getAddCommentFormText } from '../../model/selectors/addCommentFormSelectors';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { addComment } from '@/entities/Comment';

const reducers: ReducersList = {
  addCommentForm: addCommentFormReducer,
};

const AddCommentForm = memo(() => {
  const text = useSelector(getAddCommentFormText);
  const dispatch = useAppDispatch();
  const [snackBarIsOpen, setSnackBarIsOpen] = useState(false);

  const onCommentTextChange = useCallback(
    (value: string) => {
      dispatch(addCommentFormActions.setText(value));
    },
    [dispatch],
  );

  const onSendComment = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      dispatch(addComment(text));
      dispatch(addCommentFormActions.setText(''));
      setSnackBarIsOpen(true);
    },
    [dispatch, text],
  );

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Box component="form" onSubmit={onSendComment} my={2}>
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
              size={'small'}
              inputProps={{
                maxLength: 40,
              }}
              value={text}
              onChange={(e) => onCommentTextChange(e.target.value)}
            />
          </Grid>

          <Grid item xs={2} justifyContent={'center'} alignItems={'start'} display={'flex'}>
            <Button type="submit">
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={snackBarIsOpen} autoHideDuration={2000} onClose={() => setSnackBarIsOpen(false)}>
          <Alert onClose={() => setSnackBarIsOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
            Комментарий добавлен в твой список
          </Alert>
        </Snackbar>
      </Box>
    </DynamicModuleLoader>
  );
});

export default AddCommentForm;
