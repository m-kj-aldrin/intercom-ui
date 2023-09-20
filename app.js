import "./src/elements/index.js";
import "./src/com/signal.js";
import "./src/interact/menu.js";

const networkList = document.createElement("com-list");
networkList.setAttribute("should-index", "true");

const c0 = document.createElement("com-chain");
const c1 = document.createElement("com-chain");

document.body.appendChild(networkList);

networkList.appendElement(c0);
networkList.appendElement(c1);

const c0m0 = c0.addModule("LFO");
c0m0.addOut();

const c0m1 = c0.addModule();
c0m1.addOut();

c0.addModule();
c0.addModule();

c1.addModule();
c1.addModule();
c1.addModule();
const c1m2 = c1.addModule("CHA");
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();

// c0.querySelector("com-list").appendElement(c1m2);

// setTimeout(() => {
//     c0.querySelector("com-list").insertElement(c1m2, c0m0);
// }, 100);
