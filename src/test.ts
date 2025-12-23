import labag from "./index";
labag.addEventListener("gameStart", (game) => {
  console.log("Game Started!");
  console.log(`Total Rounds: ${game.times}\n`);
});
labag.addEventListener("roundStart", (game) => {
  console.log(`--- Round ${game.played} Start ---`);
});
labag.addEventListener("rollSlots", (game) => {
  console.log(`Current Mode: ${game.getCurrentMode()?.name}`);
  console.log(
    `Rate Range: ${game
      .getCurrentMode()
      ?.ranges.map((r) => `${r.pattern.name}<=${r.threshold}`)
      .join(", ")}`
  );
});
labag.addEventListener("roundEnd", (game) => {
  console.log(game.patterns.map((p) => (p ? p.name : "null")).join(" | "));
  console.log(
    `Active Modes: ${game.modes
      .filter((m) => m.active)
      .map((m) => m.name)
      .join(", ")}`
  );

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
  `Active Modes at end: ${labag.modes.map((m) => m.name).join(", ")}`
);
