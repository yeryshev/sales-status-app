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
        const externalApiUrl = import.meta.env.VITE_EXTERNAL_API_URL;
        if (!externalApiUrl) {
          throw new Error('VITE_EXTERNAL_API_URL is not configured');
        }
        return {
          url: externalApiUrl + '/usefullchats',
          credentials: 'same-origin',
        };
      },
    }),
  }),
});

export const useGetTgChats = ChatsTableApi.useGetTgChatsQuery;
