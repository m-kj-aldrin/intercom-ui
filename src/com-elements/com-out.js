import { InputBaseElement } from "../x-input/src/custom-elements/base.js";
import { IntercomBaseElement } from "./base.js";
import { PERIPHERAL_TEMPLATE } from "./com-chain.js";
import { IntercomModuleElement } from "./com-module.js";

/**@type {Set<IntercomOutElement>} */
const intercomOutSet = new Set();

const intercomOutElementTemplate = document.createElement("template");
intercomOutElementTemplate.innerHTML = `
<style>
    #cv,#gt{
        display: flex;
        gap: 4px;
    }
</style>
<div id="cv">
<div>cv:</div>
${PERIPHERAL_TEMPLATE("cv")}
</div>
<div id="gt">
<div>gt:</div>
${PERIPHERAL_TEMPLATE("gt")}
</div>
`;

export class IntercomOutElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(
            intercomOutElementTemplate.content.cloneNode(true)
        );

        this.#attachListeners();
    }

    /**@type {string|number} */
    #inputCvPid = null;
    /**@type {string|number} */
    #inputGtPid = null;
    /**@type {string|number} */
    #inputCvCh = null;
    /**@type {string|number} */
    #inputGtCh = null;

    #attachListeners() {
        this.shadowRoot.addEventListener("input", (e) => {
            if (e.target instanceof InputBaseElement) {
                switch (e.target.name) {
                    case "cv-pid":
                        this.#inputCvPid = e.target.value;
                        if (this.#inputCvCh) {
                            this.signalOut("append");
                        }
                        break;
                    case "cv-ch":
                        this.#inputCvCh = e.target.value;
                        if (this.#inputCvPid) {
                            this.signalOut("append");
                        }
                        break;
                    case "gt-pid":
                        this.#inputGtPid = e.target.value;
                        if (this.#inputGtCh) {
                            this.signalOut("append");
                        }
                        break;
                    case "gt-ch":
                        this.#inputGtCh = e.target.value;
                        if (this.#inputGtPid) {
                            this.signalOut("append");
                        }
                        break;
                }
            }
        });

        this.shadowRoot.addEventListener(
            "contextmenu",
            this.#handleContext.bind(this)
        );
    }

    // /**@type {IntercomModuleElement} */
    // #parent = null;

    // get parent() {
    //     return this.#parent;
    // }
    // set parent(parent) {
    //     this.#parent = parent;
    // }

    #attached = false;

    /**
     * @param {"append" | "remove"} type
     */
    signalOut(type) {
        let signalString = ``;
        switch (type) {
            case "append":
                if (this.#attached) {
                    this.remove();
                    this.parent.shadowRoot
                        .querySelector("#out-container")
                        .appendChild(this);
                }

                intercomOutSet.add(this);
                let cidx = this.parent.parent.index;
                let midx = this.parent.index;
                signalString = `out ${cidx}:${midx}:${this.#inputCvPid}:${
                    this.#inputCvCh
                }:${this.#inputGtPid}:${this.#inputGtCh}`;
                this.#attached = true;
                break;
            case "remove":
                if (!this.#attached) {
                    return;
                }
                signalString = `out -r ${this.index}`;
                // intercomOutSet.delete(this);
                break;
        }
        if (signalString) {
            console.log(signalString);
        }
    }

    remove() {
        this.signalOut("remove");
        super.remove();
    }

    get index() {
        let i = 0;
        for (const element of intercomOutSet.values()) {
            if (element == this) {
                return i;
            }
            i++;
        }
    }

    /**@param {MouseEvent} e */
    #handleContext(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        let x = e.clientX;
        let y = e.clientY;

        const contextElement = document.createElement("x-context");
        contextElement.style.setProperty("--x", `${x}px`);
        contextElement.style.setProperty("--y", `${y}px`);

        contextElement.innerHTML = `
        <x-momentary name="remove out">remove out</x-momentary>
        `;

        contextElement.addEventListener("input", (e) => {
            switch (e.target.name) {
                case "remove out":
                    contextElement.remove();
                    this.remove();
                    break;
            }
        });

        document.body.append(contextElement);
    }

    connectedCallback() {}
    disconnectedCallback() {
        intercomOutSet.delete(this);
    }
}
