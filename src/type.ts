export type { Plugin } from "vite";

export type TransformResult =
  | string
  | {
      code: string;
      map?: any | null;
    }
  | null
  | undefined;