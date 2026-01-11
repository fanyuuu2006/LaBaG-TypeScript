import { patterns } from "../pattern";
import { Mode } from "../mode";

export default new Mode(
  false,
  "pikachu",
  {
    gss: 0,
    hhh: 0,
    hentai: 0,
    handson: 0,
    kachu: 0,
    rrr: 0,
  },
  {
    gameStart: (_, mode) => {
      mode.active = false;
      mode.variable.times = 0;
    },
    roundEnd: (game, mode) => {
      const { patterns } = game;
      const hasBindPattern = patterns.some(
        (p) => p && p.name === mode.variable.bindPattern.name
      );

      if (!game.isRunning() && hasBindPattern) {
        mode.active = true;
        game.played -= mode.variable.bonusRounds;
        mode.variable.times += 1;
        patterns.forEach((p, i) => {
          if (p?.name === mode.variable.bindPattern.name) {
            patterns[i] = mode.variable.pattern;
          }
        });
        return;
      }

      if (mode.active && hasBindPattern) {
        game.played -= Math.min(mode.variable.times, mode.variable.bonusRounds);
      }
    },
  },
  {
    times: 0,
    pattern: {
      name: "pikachu",
      scores: [12000, 8000, 1250],
    },
    bindPattern: patterns[4],
    bonusRounds: 3,
  }
);
