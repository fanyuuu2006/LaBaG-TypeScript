import { P } from "./P";
import { Modes } from "..";
import { BaseLaBaG } from "./BaseLaBaG";
import { AllDataType } from "./LaBaG";

export class JsonLaBaG extends BaseLaBaG {
  jsonData: AllDataType;
  dataIndex: number;
  constructor() {
    super();
    this.jsonData = {};
    this.dataIndex = 1;
  }

  SetupData(data: AllDataType): void {
    this.jsonData = data;
  }

  Reset(): void {
    super.Reset();
    this.dataIndex = 1;
  }

  Random(): void {
    const currData = this.jsonData[`${this.dataIndex}`];
    if (!currData) {
      throw new Error("No data found for the current index");
    }

    try {
      const RandNums: [number, number, number] = [
        currData["RandNums[0]"] ?? 0,
        currData["RandNums[1]"] ?? 0,
        currData["RandNums[2]"] ?? 0,
      ];

      Modes.SuperHHH.RandNum = currData["SuperHHH"] ?? 0;
      Modes.GreenWei.RandNum = currData["GreenWei"] ?? 0;

      const RateRange = this.RateRanges[this.NowMode()];
      const PCodes = Array.from(P.Map.keys());

      RandNums.forEach((RandNum, i) => {
        const code = PCodes.find((_, j) => RandNum <= RateRange[j]);
        if (code) {
          this.Ps[i] = P.Map.get(code) ?? null;
        }
      });

      // 累積 GreenWei 分數
      this.Ps.forEach((p) => {
        if (
          p?.code === "A" &&
          Modes.GreenWei.Score !== undefined &&
          Modes.GreenWei.Score < 20
        ) {
          Modes.GreenWei.Score += 1;
        }
      });
    } catch (error) {
      console.error("Error in Random():", error);
      super.Random();
    }
  }

  Result(): void {
    super.Result();
    this.dataIndex++;
  }
}
