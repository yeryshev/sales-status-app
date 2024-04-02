import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { statusActions } from '@/entities/Status/model/slice/statusSlice';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { Comment } from '../../model/types/Comment';
import { deleteComment } from '../../model/services/commentsActions';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchCommentsByUserId } from '../../model/services/fetchCommentsByUserId/fetchCommentsByUserId';
import { getUserComments } from '../../model/selectors/commentSelectors';
import { AddCommentForm } from '@/features/AddCommentForm';

export const CommentsBox = memo(() => {
    const [age, setAge] = useState('');
    const user = useSelector((state: StateSchema) => state.user.user);
    const dispatch = useAppDispatch();
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const userComments = useSelector(getUserComments);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCommentsByUserId(user.id));
            dispatch(statusActions.changeStatus(user.statusId));
        }
    }, [dispatch, user?.id, user?.statusId]);

    const handlePickComment = useCallback(
        (commentId: number | null) => {
            if (user) {
                dispatch(updateUser({ ...user, commentId })).then(() => {
                    setSelectedComment(null);
                    setAge('');
                });
            }
        },
        [dispatch, user],
    );

    const handleDeleteComment = useCallback((commentId: number) => {
        if (user?.id) {
            dispatch(deleteComment(commentId)).then(() => {
                if (user.commentId === commentId) {
                    handlePickComment(null);
                }
                setSelectedComment(null);
                setAge('');
            });
        }
    }, [dispatch, handlePickComment, user?.commentId, user?.id]);

    const handleChange = useCallback((event: SelectChangeEvent) => {
        setAge(event.target.value);
    }, []);

    return (
        <>
            <FormLabel id="comments-label">
                Комментарии
                <AddCommentForm />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="demo-simple-select-label" size={'small'}>Выбрать</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-vadim"
                        value={age}
                        label="Выбрать комментарий"
                        size={'small'}
                        onChange={handleChange}
                    >
                        {userComments.map((comment) => (
                            <MenuItem
                                key={comment.id}
                                value={comment.id}
                                onClick={() => {
                                    setSelectedComment(comment);
                                }}
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
                            onClick={() => {
                                handlePickComment(selectedComment?.id || null);
                            }}
                            disabled={selectedComment === null}
                            color="success"
                            size={'small'}
                        >
                            Установить
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={() => {
                                handleDeleteComment(selectedComment?.id || 0);
                            }}
                            disabled={selectedComment === null}
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
                            onClick={() => {
                                handlePickComment(null);
                            }}
                        >
                            Очистить
                        </Button>
                    </Grid>
                </Grid>
            </FormLabel>
        </>
    );
});

