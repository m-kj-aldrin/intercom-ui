import { COMChain } from "./src/chain";
import { InteractRootEvent } from "./src/interact/index";
import { COMModule } from "./src/module";
import { COMList, _COMChain, _COMModule, _COMOut } from "./src/el";

declare global {
    interface HTMLElementTagNameMap {
        "com-chain": COMChain;
        "com-module": COMModule;

        "x-com-list": COMList;
        "x-com-chain": _COMChain;
        "x-com-module": _COMModule;
        "x-com-out": _COMOut;
    }

    interface HTMLElementEventMap {
        "interact-root:down": InteractRootEvent<{}>;
        "interact-root:enter": InteractRootEvent<{}>;
        "interact-root:up": InteractRootEvent<{}>;
    }
}
