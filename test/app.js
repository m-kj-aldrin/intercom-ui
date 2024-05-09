import "../src/com-elements/index.js";

const network = document.createElement("com-network");

document.body.append(network);

const chain0 = document.createElement("com-chain");

network.append(chain0);

const module0 = document.createElement("com-module");

const module1 = document.createElement("com-module");

chain0.append(module0, module1);

module0.setType("lfo");
module1.setType("cha");

network.innerHTML = `
<com-chain>
    <com-module type="pth"></com-module>
    <com-module type="lfo"></com-module>
    <com-module type="rep"></com-module>
</com-chain>
<com-chain>
    <com-module type="cha"></com-module>
    <com-module type="seq"></com-module>
</com-chain>
<com-chain>
</com-chain>
`;

// const testinp = document.createElement('x-input').setType("select");
// testinp.innerHTML = `
// <x-option>dog</x-option>
// <x-option>cat</x-option>
// <x-option>hat</x-option>
// `

// testinp.value = "cat"

// document.body.append(testinp)
