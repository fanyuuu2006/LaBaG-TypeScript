/**
 * 產生一個介於 min 和 max 之間的隨機整數（包含 min 和 max）。
 * @param min - 最小值。
 * @param max - 最大值。
 * @returns 介於 min 和 max 之間的隨機整數。
 */
export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
