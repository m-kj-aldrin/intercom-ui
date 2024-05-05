import { IntercomChainElement } from "./com-chain";
import { IntercomNetworkElement } from "./com-network";

declare global {
    interface HTMLElementTagNameMap {
        "com-network": IntercomNetworkElement;
        "com-chain": IntercomChainElement;
    }
}
