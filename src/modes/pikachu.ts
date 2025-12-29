import { Mode } from "../mode";

export default new Mode(
  false,
  "pikachu",
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
    },
    roundEnd: (game, mode) => {
      const { patterns } = game;
      const hasBindPattern = patterns.some(
        (p) => p && p.name === mode.variable.bindPattern
      );

      if (!game.isRunning() && hasBindPattern) {
        mode.active = true;
        game.played -= mode.variable.bonusRounds;
        mode.variable.times += 1;
        patterns.forEach((p, i) => {
          if (p?.name === mode.variable.bindPattern) {
            patterns[i] = mode.variable.pattern;
          }
        });
        return;
      }

      if (mode.active && hasBindPattern) {
        game.played -= mode.variable.times;
      }
    },
  },
  {
    times: 0,
    pattern: {
      name: "pikachu",
      scores: [12000, 8000, 1250],
    },
    bindPattern: "kachu",
    bonusRounds: 5,
  }
);
