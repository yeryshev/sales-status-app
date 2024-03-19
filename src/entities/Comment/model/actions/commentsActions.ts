import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Comment } from '../types/Comment';

export const setAllComments = createAsyncThunk('comments/setAllComments', async () => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/comments/`;
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

export const setMyComments = createAsyncThunk('comments/setMyComments', async (userId: number) => {
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

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ comment }: { comment: string }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/comments/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: comment }),
            });
            if (response.ok) {
                const comments: Comment = await response.json();
                return comments;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },
);

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
