import "../src/com-elements/index.js";

const network = document.createElement("com-network");

document.body.append(network);

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
`;
