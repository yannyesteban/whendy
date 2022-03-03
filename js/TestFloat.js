import { Float, Move, Resize } from "./FloatOld.js";
export class TestFloat {
    constructor() {
    }
}
const t = new TestFloat();
Float.init(document.getElementById("q"));
Float.init(document.getElementById("q2"));
//Float.init(document.getElementById("k1"));
Move.init({ main: document.getElementById("q"), hand: document.getElementById("q") });
Move.init({ main: document.getElementById("q2"), hand: document.getElementById("q2") });
Move.init({ main: document.getElementById("k1"), hand: document.getElementById("k2") });
Float.show({ e: document.getElementById("q2"), left: 200, top: 200 });
//Float.init(document.getElementById("q2"));
//Float.center(document.getElementById("q2"));
Resize.init({ main: document.getElementById("q2") });
Resize.init({ main: document.getElementById("k1") });
//Float.center(document.getElementById("q2"));
//# sourceMappingURL=TestFloat.js.map