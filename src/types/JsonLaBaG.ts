import { P } from "./P";
import { BaseLaBaG } from "./LaBaG";
import { Modes } from "..";

export class JsonLaBaG extends BaseLaBaG {
  jsonData: BaseLaBaG["AllData"];
  dataIndex: number;
  constructor() {
    super();
    this.jsonData = {};
    this.dataIndex = 0;
  }

  SetupData(data: BaseLaBaG["AllData"]): void {
    this.jsonData = data;
  }

  Reset(): void {
    super.Reset();
    this.dataIndex = 0;
  }

  Random(): void {
    const currData = this.jsonData[this.dataIndex];
    if (!currData) {
      super.Random();
      return;
    }

    try {
      const RandNums: [number, number, number] = [
        currData["RandNum[0]"] ?? 0,
        currData["RandNum[1]"] ?? 0,
        currData["RandNum[2]"] ?? 0,
      ];

      Modes.SuperHHH.RandNum = currData["SuperHHH"] ?? 0;
      Modes.GreenWei.RandNum = currData["GreenWei"] ?? 0;

      const RateRange = this.RateRanges[this.NowMode()];
      const PCodes = Object.keys(P.Obj);

      RandNums.forEach((RandNum, i) => {
        const code = PCodes.find((_, j) => RandNum <= RateRange[j]);
        if (code) {
          this.Ps[i] = P.Obj[code];
        }
      });

      // 累積 GreenWei 分數
      this.Ps.forEach((p) => {
        if (
          p?.Code === "A" &&
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
