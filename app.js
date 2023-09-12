import { COMChain } from "./src/chain.js";
import { attach_root } from "./src/interact/index.js";
import { COMModule } from "./src/module.js";
import { signal_to_intercom } from "./src/signal.js";

window.customElements.define("com-chain", COMChain);
window.customElements.define("com-module", COMModule);

const chain0 = document.createElement("com-chain");
const chain1 = document.createElement("com-chain");
document.body.append(chain0, chain1);

chain0.add_module("LFO");
chain0.add_module();
chain0.add_module();

chain1.add_module();
chain1.add_module("LFO");
chain1.add_module();

attach_root(document.body);

/**@type {COMModule | HTMLElement} */
let dragged_element;
/**@type {COMChain | HTMLElement} */
let dragged_chain;
let dragged_chain_idx = -1;
let dragged_idx = -1;

document.body.addEventListener("interact-root:down", (e) => {
    document.body.setAttribute("data-dragging", "true");

    dragged_element = e.detail.interactSource;
    dragged_element.setAttribute("data-dragged", "true");

    dragged_chain = e.detail.sections["chain"];
    dragged_chain_idx = dragged_chain.index;

    dragged_idx = dragged_element.index;
});

document.body.addEventListener("interact-root:up", (e) => {
    document.body.removeAttribute("data-dragging");

    if (dragged_element) {
        dragged_element.removeAttribute("data-dragged");
        dragged_element = null;
        dragged_idx = -1;

        dragged_chain = null;
        dragged_chain_idx = -1;
    }
});

document.body.addEventListener("interact-root:enter", (e) => {
    if (!dragged_element) return;
    if (dragged_element == e.detail.interactSource) return;

    const i = e.detail.interactSource.index;

    /**@type {InsertPosition} */
    let insertPosition = "beforebegin";
    if (i > dragged_idx) {
        insertPosition = "afterend";
    }

    const chain_idx = e.detail.sections["chain"].index;

    signal_to_intercom(`c ${dragged_chain_idx} -r m ${dragged_idx}`);
    signal_to_intercom(`c ${chain_idx} -a m ${i}`);

    e.detail.interactSource.insertAdjacentElement(
        insertPosition,
        dragged_element
    );

    dragged_idx = i;
});
