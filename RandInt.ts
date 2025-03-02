export function RandInt(): number {
  const min: number = 1;
  const max: number = 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
