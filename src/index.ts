import { LaBaG } from "./labag";
import * as normal from "./modes/normal";
import * as superhhh from "./modes/superhhh";
import * as greenwei from "./modes/greenwei";
import * as pikachu from "./modes/pikachu";

const labag = new LaBaG();
[superhhh, greenwei, pikachu, normal].forEach((mode) => {
  console.log(mode)
  if (mode.default.active) {
    labag.modes.push(mode.default);
  } else {
    labag.addMode(mode.default);
  }
});
export default labag;
