import { LaBaG, Mode } from "./labag";
import { randInt } from "./utils/randInt";

const labag = new LaBaG();

const modes: ConstructorParameters<typeof Mode>[] = [
  [
    true,
    "normal",
    {
      gss: 36,
      hhh: 24,
      hentai: 17,
      handson: 12,
      kachu: 8,
      rrr: 3,
    },
  ],
  [
    false,
    "superhhh",
    {
      gss: 19,
      hhh: 5,
      hentai: 19,
      handson: 19,
      kachu: 19,
      rrr: 19,
    },
    {
      roundStart: (_, mode) => {
        if (!mode.active) return;
        mode.variable.score = 0;
        mode.variable.times -= 1;
      },
      rollSlots: (game, mode) => {
        mode.variable.randNum = randInt(1, 100);
        if (mode.active) {
          if (
            game.patterns.every((pattern) => pattern && pattern.name === "hhh")
          ) {
            mode.variable.times += 2;
          }
        }
      },
      roundEnd: (game, mode) => {
        if (mode.active) {
          if (mode.variable.times <= 0) {
            mode.active = false;
          }
        } else {
          if (
            mode.variable.randNum <= mode.variable.rate &&
            game.patterns.some((pattern) => pattern && pattern.name === "hhh")
          ) {
            mode.active = true;
            mode.variable.times += 6;

            if (
              game.patterns.every(
                (pattern) => pattern && pattern.name === "hhh"
              )
            ) {
              mode.variable.score = Math.round(game.score / 2);
              game.score += mode.variable.score;
            }
          }
        }
      },
    },
    {
      times: 0,
      rate: 15,
      score: 0,
      randNum: 0,
    },
  ],
];

for (const modeArgs of modes) {
  const mode = new Mode(...modeArgs);
  labag.addMode(mode);
}

export default labag;
