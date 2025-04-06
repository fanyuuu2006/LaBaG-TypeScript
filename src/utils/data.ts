import { JsonLaBaG } from "../types/JsonLaBaG";
import { AllDataType } from "../types/LaBaG";

export const parseScore = (allData: AllDataType): number => {
  const game = new JsonLaBaG();
  game.SetupData(allData);
  game.Logic();
  return game.Score;
};

export const verifyScore = (score: number, allData: AllDataType): boolean =>
  parseScore(allData) === score;
