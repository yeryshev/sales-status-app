import { rtkApi } from '@/shared/api/rtkApi';

interface TgChat {
  id: number;
  name: string;
  description: string;
  link: string;
}

interface TgChatsData {
  chats: TgChat[];
}

const ChatsTableApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTgChats: build.query<TgChatsData, void>({
      query: () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('VITE_API_URL is not configured');
        }
        return {
          url: apiUrl + '/telegram/chats',
        };
      },
    }),
  }),
});

export const useGetTgChats = ChatsTableApi.useGetTgChatsQuery;
