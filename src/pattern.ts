import { Pattern } from "./types";

/**
 * 定義遊戲中可用的圖案及其分數。
 */
export const patterns = [
  {
    name: "gss",
    scores: [800, 400, 180],
  },
  {
    name: "hhh",
    scores: [1500, 800, 300],
  },
  {
    name: "hentai",
    scores: [2500, 1200, 500],
  },
  {
    name: "handson",
    scores: [2900, 1450, 690],
  },
  {
    name: "kachu",
    scores: [12000, 8000, 1250],
  },
  {
    name: "rrr",
    scores: [20000, 12000, 2500],
  },
] as const satisfies readonly Pattern[];
