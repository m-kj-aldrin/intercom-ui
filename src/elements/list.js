import COMBase from "./base.js";

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
        switch (name) {
            case "should-index":
                const b = newValue == "true" ? true : false;
                if (this.isIndexing) {
                    if (!b && this.observer) {
                        this.observer?.disconnect();
                    }
                    return;
                }

                const observer = new MutationObserver(indexer);

                observer.observe(this, {
                    childList: true,
                });

                break;
        }
    }
}
