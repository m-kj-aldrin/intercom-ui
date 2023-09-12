import { COMChain } from "./src/chain";
import { InteractRootEvent } from "./src/interact/index";
import { COMModule } from "./src/module";

declare global {
    interface HTMLElementTagNameMap {
        "com-chain": COMChain;
        "com-module": COMModule;
    }

    interface HTMLElementEventMap {
        "interact-root:down": InteractRootEvent<{}>;
        "interact-root:enter": InteractRootEvent<{}>;
        "interact-root:up": InteractRootEvent<{}>;
    }
}
