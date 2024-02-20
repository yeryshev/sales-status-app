export type ValidationError = {
  detail: [
    {
      loc: [string, number];
      msg: string;
      type: string;
    }
  ];
};
