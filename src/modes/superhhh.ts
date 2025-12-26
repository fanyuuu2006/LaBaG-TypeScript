import { Mode } from "../mode";
import { randInt } from "../utils/randInt";

export default new Mode(
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
    gameStart: (_, mode) => {
      mode.active = false;
      mode.variable.times = 0;
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
        game.patterns.every((p) => p?.name === "hhh") &&
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
        if (p?.name === "hhh") hhhCount++;
        else allHHH = false;
      }

      if (mode.active) {
        if (allHHH) {
          variable.times += 2;
        }
        if (variable.times <= 0) {
          mode.active = false;
        }
      } else {
        if (variable.randNum <= variable.rate && hhhCount > 0) {
          mode.active = true;
          variable.times += 6;

          for (let i = 0; i < patterns.length; i++) {
            if (patterns[i]?.name === "hhh") {
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
    pattern: {
      name: "superhhh",
      scores: [1500, 800, 300],
    },
  }
);
