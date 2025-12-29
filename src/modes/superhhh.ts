import { patterns } from "src/pattern";
import { Mode } from "../mode";
import { randInt } from "../utils/randInt";

export default new Mode(
  false,
  "superhhh",
  {
    gss: 2,
    hhh: -14,
    hentai: 21,
    handson: 26,
    kachu: 30,
    rrr: 35,
  },
  {
    gameStart: (_, mode) => {
      mode.active = false;
      mode.variable.times = 0;
      mode.variable.score = 0;
    },
    roundStart: (_, mode) => {
      if (!mode.active) return;
      mode.variable.score = 0;
      mode.variable.times -= 1;
    },
    rollSlots: (_, mode) => {
      mode.variable.randNum = randInt(1, 100);
    },
    calculateScore: (game, mode) => {
      if (mode.active) return;
      if (
        game.patterns.every(
          (p) => p?.name === mode.variable.bindPattern.name
        ) &&
        mode.variable.randNum <= mode.variable.rate
      ) {
        mode.variable.score += Math.round(game.score / 2);
        game.marginScore += mode.variable.score;
      }
    },
    roundEnd: (game, mode) => {
      const { patterns } = game;
      const { variable } = mode;

      let hhhCount = 0;
      let allHHH = true;
      for (const p of patterns) {
        if (p?.name === mode.variable.bindPattern.name) hhhCount++;
        else allHHH = false;
      }

      if (mode.active) {
        if (allHHH) {
          variable.times += mode.variable.extendTimes;
        }
        if (variable.times <= 0) {
          mode.active = false;
        }
      } else {
        if (variable.randNum <= variable.rate && hhhCount > 0) {
          mode.active = true;
          variable.times += variable.bonusTimes;

          for (let i = 0; i < patterns.length; i++) {
            if (patterns[i]?.name === mode.variable.bindPattern.name) {
              patterns[i] = variable.pattern;
            }
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
    bindPattern: patterns[1],
    bonusTimes: 6,
    pattern: {
      name: "superhhh",
      scores: [1500, 800, 300],
    },
    extendTimes: 2,
  }
);
