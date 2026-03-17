export type Pattern = {
  id: string | number;
  weight: number;
  image: string;
};

export type Payout = {
  id: string | number;
  pattern_id: Pattern["id"];
  match_count: number;
  reward: number;
};
