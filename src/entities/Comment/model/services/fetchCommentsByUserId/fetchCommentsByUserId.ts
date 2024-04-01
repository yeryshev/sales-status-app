import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment } from '../../types/Comment';

export const fetchCommentsByUserId = createAsyncThunk('comments/fetchCommentsByUserId', async (userId: number) => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/comments/?user=${userId}`;
        const response = await fetch(url, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            const comments: Comment[] = await response.json();
            return comments;
        } else {
            return [];
        }
    } catch (error: unknown) {
        return [];
    }
});