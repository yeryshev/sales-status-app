import { createAsyncThunk } from '@reduxjs/toolkit';
import { Comment } from '../../../types/Comment';

export const setComments = createAsyncThunk('comments/setComments', async (userId: number) => {
  try {
    const response = await fetch(`/api/status/${userId}/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
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
  async ({ comment, userId }: { comment: string; userId: number }) => {
    try {
      const response = await fetch(`/api/status/${userId}/`, {
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
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: number) => {
    try {
      const response = await fetch(`/api/status/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return commentId;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);
