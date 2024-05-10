import { XContextElement } from "../x-context/x-context";
import { IntercomChainElement } from "./com-chain";
import { IntercomModuleElement } from "./com-module";
import { IntercomNetworkElement } from "./com-network";
import { IntercomOutElement } from "./com-out";

declare global {
    interface HTMLElementTagNameMap {
        "com-network": IntercomNetworkElement;
        "com-chain": IntercomChainElement;
        "com-module": IntercomModuleElement;
        "com-out": IntercomOutElement
        "x-context": XContextElement;

    }
}
