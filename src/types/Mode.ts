import { LaBaG } from "./LaBaG";

export type Mode = {
  InMode?: boolean;
  Rate?: number;
  Times?: number;
  Score?: number;
  RandNum?: number;
  Random?: () => void;
  Judge?: (Game: LaBaG) => void;
};

export type ModeNames = "Normal" | "GreenWei" | "SuperHHH" | "PiKaChu";
