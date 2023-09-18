import COMChain from "./src/elements/chain";
import COMList from "./src/elements/list";
import COMModule from "./src/elements/module";
import { COMOut } from "./src/elements/out";
import COMParameter from "./src/elements/parameter";
import { InteractRootEvent } from "./src/interact/index";

declare global {
    interface HTMLElementTagNameMap {
        "com-list": COMList;
        "com-chain": COMChain;
        "com-module": COMModule;
        "com-out": COMOut;
        "com-parameter": COMParameter;
    }

    interface HTMLElementEventMap {}
}
