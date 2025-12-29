import { Mode } from "../mode";
import { randInt } from "../utils/randInt";

export default new Mode(
  false,
  "greenwei",
  {
    gss: 36,
    hhh: 24,
    hentai: 17,
    handson: 12,
    kachu: 8,
    rrr: 3,
  },
  {
    gameStart: (_, mode) => {
      mode.active = false;
      mode.variable.times = 0;
      mode.variable.count = 0;
    },
    roundStart: (_, mode) => {
      if (!mode.active) return;
      mode.variable.times -= 1;
    },
    rollSlots: (_, mode) => {
      mode.variable.randNum = randInt(1, 100);
    },
    calculateScore: (game, mode) => {
      if (mode.active) {
        game.marginScore = Math.round(game.marginScore * 3);
      }
    },
    roundEnd: (game, mode) => {
      const { patterns } = game;
      const { variable } = mode;

      let gssCount = 0;
      let allGSS = true;
      for (const p of patterns) {
        if (p?.name === mode.variable.bindPattern) {
          gssCount++;
        } else {
          allGSS = false;
        }
      }

      variable.count += gssCount;

      if (mode.active) {
        if (allGSS) {
          variable.times += mode.variable.extendTimes;
        }
        if (variable.times <= 0) {
          mode.active = false;
        }
      } else {
        let activated = false;
        if (variable.randNum <= variable.rate && allGSS) {
          activated = true;
          variable.times += mode.variable.extendTimes;
        } else if (variable.count >= mode.variable.requiredGssCount) {
          activated = true;
          variable.times += mode.variable.bonusTimes;
          variable.count -= mode.variable.requiredGssCount;
        }

        if (activated) {
          mode.active = true;
          for (let i = 0; i < patterns.length; i++) {
            if (patterns[i]?.name === mode.variable.bindPattern) {
              patterns[i] = variable.pattern;
            }
          }
        }
      }
    },
  },
  {
    times: 0,
    rate: 35,
    randNum: 0,
    count: 0,
    pattern: {
      name: "greenwei",
      scores: [800, 400, 180],
    },
    extendTimes: 2,
    bindPattern: "gss",
    bonusTimes: 2,
    requiredGssCount: 20,
  }
);
