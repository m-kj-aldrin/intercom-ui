import { signal_to_intercom } from "../com/signal.js";
import COMBase from "./base.js";
import COMChain from "./chain.js";
import COMModule from "./module.js";
import COMOut from "./out.js";

/**@param {COMChain | COMModule | COMOut} target */
export function extractContext(target) {
    if (target instanceof COMChain) {
        return {
            target: { target, index: target.index },
            chain: null,
            module: null,
        };
    }
    if (target instanceof COMModule) {
        return {
            target: { target, index: target.index },
            chain: target.closest("com-chain").index,
            module: null,
        };
    }
    if (target instanceof COMOut) {
        return {
            target: { target, index: target.index },
            chain: target.closest("com-chain").index,
            module: target.closest("com-module").index,
        };
    }
}

/**@type {MutationCallback} */
function indexer(mutations) {
    mutations.forEach((mutation) => {
        /** @type {HTMLCollection} */ // @ts-ignore
        const children = mutation.target.children;

        let i = 0;
        for (const child of children) {
            child.index = i;
            i++;
        }
    });
}

/**@param {HTMLCollection | NodeListOf<Element>} */
function index(children) {
    let i = 0;
    for (const element of children) {
        element.index = i;
        i++;
    }
}

/**
 * @template {HTMLElement} T
 * @typedef {T} ExtendsHTMLElement
 */

export default class COMList extends COMBase {
    static get observedAttributes() {
        return ["should-index"];
    }
    constructor() {
        super();

        /**@private */
        this.isIndexing = false;

        /**@readonly @type {MutationObserver} */
        this.observer = null;
    }

    attributeChangedCallback(name, newValue, oldValue) {
        // switch (name) {
        //     case "should-index":
        //         const b = newValue == "true" ? true : false;
        //         if (this.isIndexing) {
        //             if (!b && this.observer) {
        //                 this.observer?.disconnect();
        //             }
        //             return;
        //         }
        //         const observer = new MutationObserver(indexer);
        //         observer.observe(this, {
        //             childList: true,
        //         });
        //         break;
        // }
    }

    moveElement() {}

    /**
     * @template {HTMLElement} T
     * @param {T} toAppend
     * @param {boolean} [signal]
     */
    appendElement(toAppend, signal = true) {
        if (signal && toAppend.attached) {
            this.dispatchEvent(
                new CustomEvent("com:element", {
                    bubbles: true,
                    detail: {
                        target: toAppend,
                        action: "remove",
                    },
                })
            );
        }

        this.appendChild(toAppend);
        index(this.querySelectorAll(":scope > :where(com-chain,com-module)"));

        if (signal) {
            this.dispatchEvent(
                new CustomEvent("com:element", {
                    bubbles: true,
                    detail: {
                        target: toAppend,
                        action: "append",
                    },
                })
            );
        }
    }

    /**
     * @template {HTMLElement} T
     * @param {T} toInsert
     * @param {T} target
     * @param {boolean} [signal]
     */
    insertElement(toInsert, target, signal = true) {
        if (signal && toInsert.attached) {
            this.dispatchEvent(
                new CustomEvent("com:element", {
                    bubbles: true,
                    detail: {
                        target: toInsert,
                        action: "remove",
                    },
                })
            );
        }

        this.insertBefore(toInsert, target);
        index(this.querySelectorAll(":scope > :where(com-chain,com-module)"));

        if (signal) {
            this.dispatchEvent(
                new CustomEvent("com:element", {
                    bubbles: true,
                    detail: {
                        target: toInsert,
                        action: "insert",
                    },
                })
            );
        }
    }
}
