import { labag } from "./index";
labag.addEventListener("gameStart", (game) => {
  console.log("Game Started!");
  console.log(`Total Rounds: ${game.times}\n`);
});
labag.addEventListener("roundStart", (game) => {
  console.log(`--- Round ${game.rounds} Start ---`);
});
labag.addEventListener("rollSlots", (game) => {
  const { modes, ranges } = game.getCurrentConfig();
  console.log(`Active Modes: ${modes.map((m) => m.name).join(", ")}`);
  console.log(
    `Probability Ranges: ${ranges
      .map((r) => `${r.pattern.name}<=${r.threshold}`)
      .join(", ")}`
  );
});
labag.addEventListener("roundEnd", (game) => {
  console.log(game.patterns.map((p) => (p ? p.name : "null")).join(" | "));
  console.log(`Margin Score: ${game.marginScore}`);
  console.log(`Score: ${game.score}\n`);
});

labag.init();
while (labag.isRunning()) {
  labag.play();
}

console.log("Game Over");
console.log(`Final Score: ${labag.score}`);
console.log(
  `Active Modes at end: ${labag
    .getCurrentConfig()
    .modes.map((m) => m.name)
    .join(", ")}`
);
