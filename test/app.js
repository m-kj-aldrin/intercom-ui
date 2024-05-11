import "../src/com-elements/index.js";
import { waitForDomUpdate } from "../src/x-input/src/utils/dom.js";

const network = document.createElement("com-network");
document.body.append(network);

// const chain0 = document.createElement("com-chain");
const chain0 = network.createChain();

const module00 = chain0.insertModule("lfo");
const module01 = chain0.insertModule("pth");
// const module02 = chain0.appendModule("cha");

// chain0.insertModule("cha", 2);

chain0.insertModule(module00, 1);

// chain0.insertModule(module02, 0);

// network.append(chain0);

// const module0 = document.createElement("com-module").setType("lfo");

// const module1 = document.createElement("com-module").setType("cha");

// // chain0.append(module0, module1);
// chain0.insertChild(module0, module1);

// network.innerHTML = `
// <com-chain>
//     <com-module type="pth"></com-module>
//     <com-module type="lfo"></com-module>
//     <com-module type="rep"></com-module>
// </com-chain>
// <com-chain>
//     <com-module type="cha"></com-module>
//     <com-module type="seq"></com-module>
// </com-chain>
// <com-chain>
// </com-chain>
// `;

// const testinp = document.createElement('x-input').setType("select");
// testinp.innerHTML = `
// <x-option>dog</x-option>
// <x-option>cat</x-option>
// <x-option>hat</x-option>
// `

// testinp.value = "cat"

// document.body.append(testinp)
