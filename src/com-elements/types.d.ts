import { XContextElement } from "../x-context/x-context";
import { IntercomChainElement } from "./com-chain";
import { IntercomModuleElement } from "./com-module";
import { IntercomNetworkElement } from "./com-network";

declare global {
    interface HTMLElementTagNameMap {
        "com-network": IntercomNetworkElement;
        "com-chain": IntercomChainElement;
        "com-module": IntercomModuleElement;
        "x-context": XContextElement;
    }
}
