import { createAsyncThunk } from '@reduxjs/toolkit';

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.ok) {
                return commentId;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },
);
