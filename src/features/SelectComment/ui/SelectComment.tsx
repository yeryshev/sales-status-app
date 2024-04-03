import { memo, useCallback, useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { deleteComment } from '@/entities/Comment/model/services/commentsActions';
import { Comment, fetchCommentsByUserId } from '@/entities/Comment';
import { useSelector } from 'react-redux';
import { getUserComments } from '@/entities/Comment/model/selectors/commentSelectors';
import { StateSchema } from '@/app/providers/StoreProvider';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';

export const SelectComment = memo(() => {
    const user = useSelector((state: StateSchema) => state.user.user);
    const dispatch = useAppDispatch();
    const [age, setAge] = useState('');
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const userComments = useSelector(getUserComments);

    useEffect(() => {
        user && dispatch(fetchCommentsByUserId(user.id));
    }, [dispatch, user]);

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
        </>
    );
});