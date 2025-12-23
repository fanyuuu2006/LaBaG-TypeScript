import labag from "./index";
labag.addEventListener("gameStart", (game) => {
  console.log("Game Started!");
  console.log(`Total Rounds: ${game.times}\n`);
});
labag.addEventListener("roundStart", (game) => {
  console.log(`--- Round ${game.rounds} Start ---`);
});
labag.addEventListener("rollSlots", (game) => {
  console.log(
    `Active Modes: ${game.getActiveModes()
      .map((m) => m.name)
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
  `Active Modes at end: ${labag.modes.map((m) => m.name).join(", ")}`
);
