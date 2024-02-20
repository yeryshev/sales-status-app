export type MangoRedisData = {
  [key: string]: boolean;
};

export type MangoWsData = {
  type: 'mango' | 'tasks';
  data: {
    [key: string]: boolean;
  };
};
