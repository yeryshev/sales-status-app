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

const TgChatsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTgChats: build.query<TgChatsData, void>({
      query: () => ({
        url: import.meta.env.VITE_API_URL + '/telegram/chats',
      }),
    }),
  }),
});

export const useGetTgChats = TgChatsApi.useGetTgChatsQuery;
