import { IntercomChainElement } from "./com-chain.js";
import { IntercomModuleElement } from "./com-module.js";
import { IntercomNetworkElement } from "./com-network.js";
import { IntercomParameterElement } from "./com-parameter.js";

customElements.define("com-network", IntercomNetworkElement);
customElements.define("com-chain", IntercomChainElement);
customElements.define("com-module", IntercomModuleElement);
customElements.define("com-parameter", IntercomParameterElement);
