declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;