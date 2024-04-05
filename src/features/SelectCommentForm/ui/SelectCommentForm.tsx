import { memo, useCallback, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { Comment, fetchCommentsByUserId, getUserComments } from '@/entities/Comment';
import { useSelector } from 'react-redux';
import { StateSchema } from '@/app/providers/StoreProvider';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { deleteComment } from '../model/services/deleteComment/deleteComment';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
    selectCommentFormActions,
    selectCommentFormReducer,
} from '../model/slices/selectCommentSlice/selectCommentFormSlice';
import { getCommentItem, getCommentSelectValue } from '../model/selectors/selectCommentFormSelectors';

const reducers: ReducersList = {
    selectComment: selectCommentFormReducer,
};

export const SelectCommentForm = memo(() => {
    const user = useSelector((state: StateSchema) => state.user.user);
    const dispatch = useAppDispatch();
    const userComments = useSelector(getUserComments);
    const commentItem = useSelector(getCommentItem);
    const commentSelectValue = useSelector(getCommentSelectValue);

    useEffect(() => {
        user && dispatch(fetchCommentsByUserId(user.id));
    }, [dispatch, user]);

    const handlePickComment = useCallback((commentId: number | null) => {
        user && dispatch(updateUser({ ...user, commentId }));
        dispatch(selectCommentFormActions.setCommentSelectValue(''));
        dispatch(selectCommentFormActions.setCommentItem(undefined));
    },
    [dispatch, user],
    );

    const handleDeleteComment = useCallback((commentId: number) => {
        dispatch(deleteComment(commentId));
        user?.commentId === commentId && handlePickComment(null);
        dispatch(selectCommentFormActions.setCommentSelectValue(''));
        dispatch(selectCommentFormActions.setCommentItem(undefined));
    }, [dispatch, handlePickComment, user]);

    const handleClickMenuItem = useCallback((comment: Comment) => {
        dispatch(selectCommentFormActions.setCommentItem(comment));
    }, [dispatch]);

    const handleChange = useCallback((event: SelectChangeEvent) => {
        dispatch(selectCommentFormActions.setCommentSelectValue(event.target.value));
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                    id="demo-simple-select-label"
                    size={'small'}
                >Выбрать
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-vadim"
                    value={commentSelectValue}
                    onChange={handleChange}
                    label="Выбрать комментарий"
                    size={'small'}
                >
                    {userComments.map((comment) => (
                        <MenuItem
                            key={comment.id}
                            value={comment.id}
                            onClick={() => handleClickMenuItem(comment)}
                            disabled={user?.commentId === comment.id}
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
                        onClick={() => handlePickComment(commentItem?.id || null)}
                        disabled={!commentSelectValue}
                        color="success"
                        size={'small'}
                    >
                Установить
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={() => commentItem && handleDeleteComment(commentItem.id)}
                        disabled={!commentSelectValue}
                        color="error"
                        size={'small'}
                    >
                Удалить
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        disabled={user?.commentId === null}
                        size={'small'}
                        onClick={() => handlePickComment(null)}
                    >
                Очистить
                    </Button>
                </Grid>
            </Grid>
        </DynamicModuleLoader>
    );
});