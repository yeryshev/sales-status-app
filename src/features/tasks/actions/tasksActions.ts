import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Task } from '../../../app/types/Task'

export const setTasks = createAsyncThunk('tasks/setTasks', async () => {
    try {
        const response = await fetch('/api/tasks/', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const tasks: Task[] = await response.json()
            return tasks
        } else {
            return []
        }
    } catch (error: unknown) {
        return []
    }
})

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async ({
        date,
        statusId,
        commentId
    }: {
    date: Date
    statusId: number
    commentId: number | null
  }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
                method: 'POST',
                body: JSON.stringify({
                    date,
                    statusId,
                    commentId
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json()
                return data
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }
)

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string) => {
    try {
        const response = await fetch('/api/tasks/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId
            })
        })
        if (response.ok) {
            return taskId
        } else {
            return null
        }
    } catch (error) {
        return null
    }
})
