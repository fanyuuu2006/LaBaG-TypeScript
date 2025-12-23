import { LaBaG, Mode, patterns } from "./labag";
import { randInt } from "./utils/randInt";

const labag = new LaBaG();

const modes: ConstructorParameters<typeof Mode>[] = [
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
    },
  ],
  [
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
          if (p?.name === "gss") gssCount++;
          else allGSS = false;
        }

        variable.count += gssCount;

        if (mode.active) {
          if (allGSS) {
            variable.times += 1;
          }
          if (variable.times <= 0) {
            mode.active = false;
          }
        } else {
          let activated = false;
          if (variable.randNum <= variable.rate && allGSS) {
            activated = true;
            variable.times += 2;
          } else if (variable.count >= 20) {
            activated = true;
            variable.times += 2;
            variable.count -= 20;
          }

          if (activated) {
            mode.active = true;
            for (let i = 0; i < patterns.length; i++) {
              if (patterns[i]?.name === "gss") {
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
    },
  ],
  [
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
        if (
          !game.isRunning() &&
          game.patterns.some((p) => p && p.name === "kachu")
        ) {
          mode.active = true;
          game.played -= 5;
          mode.variable.times += 1;
        }
      },
    },
    {
      times: 0,
      pattern: {
        name: "pikachu",
        scores: [12000, 8000, 1250],
      },
    },
  ],
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
];

for (const modeArgs of modes) {
  const mode = new Mode(...modeArgs);
  labag.addMode(mode);
}

export default labag;
